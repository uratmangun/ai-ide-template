import { Hono } from "hono";

import { validateProviderBaseUrl } from "./provider-url";

type Env = {
  Bindings: {
    ASSETS: Fetcher;
  };
};

type ChatPart = {
  type?: string;
  text?: string;
};

type ChatMessage = {
  role?: string;
  parts?: ChatPart[];
};

type ChatRequest = {
  messages?: ChatMessage[];
  model?: string;
  baseURL?: string;
  apiKey?: string;
};

type ProxyModel = {
  id?: string;
  owned_by?: string;
};

type ProxyModelsResponse = {
  data?: ProxyModel[];
};

type UiModel = {
  id: string;
  name: string;
  provider: string;
  providerLabel: string;
};

const DEFAULT_MODEL = "titan-5.4";

const REPO_SYSTEM_PROMPT = [
  "You are the assistant for this AI IDE template repository. https://github.com/uratmangun/ai-ide-template",
  "Keep every answer grounded in this repository, its clone flow, its Hono streaming chat worker, and its Cloudflare Worker deployment.",
  "When the user asks how to reuse it, prefer explaining how to create a new repository from the template with GitHub CLI, including a private example such as gh repo create <new-repo> --template uratmangun/ai-ide-template --private --clone.",
  "If the user asks a broader question, answer it through the lens of customizing this repository instead of switching to unrelated topics.",
].join(" ");

const app = new Hono<Env>();

function normalizeMessages(messages: ChatMessage[]) {
  return messages
    .map((message) => {
      const role = message.role === "assistant" ? "assistant" : "user";
      const content = (message.parts ?? [])
        .filter((part) => part.type === "text" && typeof part.text === "string")
        .map((part) => part.text?.trim() ?? "")
        .filter(Boolean)
        .join("\n\n");

      if (!content) {
        return null;
      }

      return { role, content };
    })
    .filter((message): message is { role: "user" | "assistant"; content: string } => message !== null);
}

function toTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferProvider(modelId: string) {
  const normalized = modelId.toLowerCase();

  if (normalized.includes("gemini")) {
    return { provider: "google", providerLabel: "Google" };
  }

  if (normalized.includes("qwen")) {
    return { provider: "alibaba", providerLabel: "Alibaba" };
  }

  if (normalized.includes("claude")) {
    return { provider: "anthropic", providerLabel: "Anthropic" };
  }

  if (normalized.includes("llama")) {
    return { provider: "llama", providerLabel: "Llama" };
  }

  if (normalized.includes("mistral")) {
    return { provider: "mistral", providerLabel: "Mistral" };
  }

  if (normalized.includes("deepseek")) {
    return { provider: "deepseek", providerLabel: "DeepSeek" };
  }

  if (normalized.includes("grok")) {
    return { provider: "xai", providerLabel: "xAI" };
  }

  return { provider: "openai", providerLabel: "OpenAI-compatible" };
}

function humanizeModelName(modelId: string) {
  return (
    modelId
      .split(/[/:]/)
      .pop()
      ?.split("-")
      .map((part) => {
        if (/^\d+(?:\.\d+)?$/.test(part)) {
          return part;
        }

        if (part.length <= 3) {
          return part.toUpperCase();
        }

        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ") || modelId
  );
}

function normalizeModel(model: ProxyModel): UiModel | null {
  const id = model.id?.trim();

  if (!id) {
    return null;
  }

  const owner = model.owned_by?.trim();
  const inferred = inferProvider(id);

  return {
    id,
    name: humanizeModelName(id),
    provider: inferred.provider,
    providerLabel: owner ? toTitleCase(owner) : inferred.providerLabel,
  };
}

app.post("/api/models", async (c) => {
  const { baseURL: rawBaseURL, apiKey: rawApiKey } = await c.req.json<{
    baseURL?: string;
    apiKey?: string;
  }>();

  const baseURL = rawBaseURL?.trim() ?? "";
  const apiKey = rawApiKey?.trim();

  if (!baseURL) {
    return c.json(
      {
        data: [],
        configured: false,
        message: "Open provider settings and add an OpenAI-compatible URL to load models.",
      },
      200
    );
  }

  const validatedBaseURL = validateProviderBaseUrl(baseURL);

  if (!validatedBaseURL.ok) {
    return c.json(
      {
        data: [],
        configured: true,
        message: validatedBaseURL.error,
      },
      200
    );
  }

  try {
    const response = await fetch(`${validatedBaseURL.normalizedUrl}/models`, {
      headers: apiKey
        ? {
            Authorization: `Bearer ${apiKey}`,
          }
        : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Model fetch failed with status ${response.status}`);
    }

    const payload = (await response.json()) as ProxyModelsResponse;
    const normalized = (payload.data ?? [])
      .map(normalizeModel)
      .filter((model): model is UiModel => model !== null);

    return c.json(
      {
        data: normalized,
        configured: true,
        message:
          normalized.length === 0
            ? "No models were returned by the configured OpenAI-compatible API."
            : null,
      },
      200
    );
  } catch {
    return c.json(
      {
        data: [],
        configured: true,
        message: "Could not load models from the configured OpenAI-compatible API.",
      },
      200
    );
  }
});

app.post("/api/chat", async (c) => {
  const {
    messages = [],
    model,
    baseURL: rawBaseURL,
    apiKey: rawApiKey,
  } = await c.req.json<ChatRequest>();

  const baseURL = rawBaseURL?.trim() ?? "";
  const apiKey = rawApiKey?.trim();
  const validatedBaseURL = validateProviderBaseUrl(baseURL);

  if (!validatedBaseURL.ok) {
    return c.json({ error: validatedBaseURL.error }, 400);
  }

  const normalizedMessages = normalizeMessages(messages);

  if (normalizedMessages.length === 0) {
    return c.json({ error: "Add a message before sending a chat request." }, 400);
  }

  const upstreamResponse = await fetch(`${validatedBaseURL.normalizedUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey
        ? {
            Authorization: `Bearer ${apiKey}`,
          }
        : {}),
    },
    body: JSON.stringify({
      model: model?.trim() || DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: REPO_SYSTEM_PROMPT,
        },
        ...normalizedMessages,
      ],
      stream: true,
    }),
  });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    const detail = await upstreamResponse.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: detail || `Chat request failed with status ${upstreamResponse.status}.` }),
      {
        status: upstreamResponse.status || 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamResponse.body!.getReader();
      let buffer = "";

      const flushDataLine = (line: string) => {
        const value = line.slice(5).trim();

        if (!value || value === "[DONE]") {
          return;
        }

        try {
          const payload = JSON.parse(value) as {
            choices?: Array<{
              delta?: {
                content?: string;
              };
            }>;
          };
          const content = payload.choices?.[0]?.delta?.content;

          if (!content) {
            return;
          }

          controller.enqueue(encoder.encode(content));
        } catch {
          // Ignore malformed SSE chunks from upstream.
        }
      };

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            buffer += decoder.decode();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              flushDataLine(line);
            }
          }
        }

        if (buffer.startsWith("data:")) {
          flushDataLine(buffer);
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Encoding": "identity",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
});

app.all("/api/*", (c) => c.json({ error: "Not found." }, 404));

app.on(["GET", "HEAD"], "*", (c) => c.env.ASSETS.fetch(c.req.raw));
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

app.onError((error, c) => {
  console.error(error);
  const message = error instanceof Error ? error.message : "Internal server error.";
  return c.json({ error: message }, 500);
});

export default app;
