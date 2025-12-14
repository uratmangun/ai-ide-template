# AI IDE Template

A minimal template for AI-powered IDE projects with pre-configured settings for popular AI coding assistants.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Furatmangun%2Fai-ide-template)

## 🚀 Quick Start

### Prerequisites

Make sure you have the [GitHub CLI](https://cli.github.com/) installed:

```bash
# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Linux (Debian/Ubuntu)
sudo apt install gh

# Authenticate with GitHub
gh auth login
```

### Clone this Template

Use the GitHub CLI to create a new repository from this template:

#### Create a Private Repository (Recommended)

```bash
gh repo create my-new-repo --template uratmangun/ai-ide-template --private --clone
```

#### Create a Public Repository

```bash
gh repo create my-new-repo --template uratmangun/ai-ide-template --public --clone
```

### Command Options

| Flag | Description |
|------|-------------|
| `--template` | Specify the template repository to use |
| `--private` | Create a private repository |
| `--public` | Create a public repository |
| `--clone` | Clone the new repository to your local machine |

### Additional Options

```bash
# Create without cloning (useful for remote-only setup)
gh repo create my-new-repo --template uratmangun/ai-ide-template --private

# Clone to a specific directory
gh repo create my-new-repo --template uratmangun/ai-ide-template --private --clone
cd my-new-repo
```

## 📁 What's Included

This template comes pre-configured with:

- **`.agent/`** - Agent workflow configurations
- **`.cursor/`** - Cursor IDE settings
- **`.kiro/`** - Kiro AI assistant configurations
- **`index.html`** - Template landing page

## 🔧 After Cloning

1. **Navigate to your new project:**
   ```bash
   cd my-new-repo
   ```

2. **Customize the template:**
   - Update `index.html` with your project details
   - Modify AI assistant configurations as needed

3. **Deploy to Vercel (optional):**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   
   # Link to GitHub for auto-deployments
   vercel git connect
   ```

## 🌐 Live Demo

Visit the template landing page: [https://ai-ide-template.vercel.app](https://ai-ide-template.vercel.app)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the AI-assisted development community
