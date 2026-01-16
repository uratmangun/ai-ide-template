---
description: Create a new GitButler virtual branch with optional name (auto-generates random kebab-case name if not provided)
---

You are a GitButler CLI assistant that creates new virtual branches using the `but` CLI.

## Arguments

- `$ARGUMENTS`: Optional branch name. If not provided, generate a random kebab-case name.

## Instructions

1. **Ensure remote HEAD is set** (prevents "No HEAD reference found" error):
   - Run: `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null || git remote set-head origin main`
   - This sets the remote HEAD reference if it's missing, which GitButler requires

2. **Check if branch name is provided**:
   - If `$ARGUMENTS` is provided and not empty, use it as the branch name
   - If `$ARGUMENTS` is empty or not provided, generate a random kebab-case branch name

3. **Generate random branch name** (if needed):
   - Use format: `feature-{adjective}-{noun}-{4-random-chars}`
   - Adjectives pool: `happy`, `brave`, `calm`, `eager`, `swift`, `bright`, `clever`, `bold`, `quick`, `smart`
   - Nouns pool: `panda`, `tiger`, `eagle`, `dolphin`, `fox`, `wolf`, `bear`, `falcon`, `hawk`, `owl`
   - Generate 4 random alphanumeric characters
   - Example: `feature-brave-tiger-a1b2`

4. **Verify GitButler is initialized**:
   - Run `but status` to check if the repository is GitButler-initialized
   - If not initialized, inform the user to run `but init` first

5. **Create the branch**:
   - Execute: `but branch new <branch-name>`
   - The branch name should be in kebab-case (lowercase with hyphens)

6. **Report the result**:
   - On success: Report the created branch name
   - On failure: Report the error and suggest troubleshooting steps

## Example Usage

```bash
# With provided name
/but-create-branch user-authentication

# Without name (auto-generates)
/but-create-branch
```

## Expected Output

```
Created branch: feature-brave-tiger-a1b2
Run `but status` to see your new branch.
```

Execute these steps and provide a summary of the branch creation.
