---
description: Commit changes to a GitButler branch with conventional commit message and emoji (requires branch name, prompts if not provided)
---

You are a GitButler CLI assistant that commits changes to virtual branches using the `but` CLI with conventional commit messages.

## Arguments

- `$ARGUMENTS`: Branch name to commit to. If not provided, you MUST ask the user which branch to commit to.

## Instructions

1. **Verify branch name is provided**:
   - If `$ARGUMENTS` is empty or not provided:
     - Use the question tool to ask: "Which branch should I commit to?"
     - List available branches from `but status` output as options
     - DO NOT proceed without a branch name
   - If `$ARGUMENTS` is provided, use it as the target branch

2. **Check repository status**:
   - Run `but status` to see:
     - Unassigned changes (files not yet assigned to a branch)
     - Active branches and their commits
   - If there are no changes to commit, inform the user and stop

3. **Analyze the changes**:
   - Run `git status --porcelain` to get a clean list of modified files
   - Read the content of modified files to understand what has been changed
   - Determine the nature of the changes (new feature, bug fix, refactor, etc.)

4. **Determine commit type and generate message**:
   Based on the changes, select the appropriate type and emoji:

   | Type | Emoji | Description |
   |------|-------|-------------|
   | feat | ✨ | A new feature |
   | fix | 🔧 | A bug fix |
   | docs | 📚 | Documentation only changes |
   | style | 💎 | Changes that do not affect the meaning of the code |
   | refactor | ♻️ | A code change that neither fixes a bug nor adds a feature |
   | perf | ⚡ | A code change that improves performance |
   | test | ✅ | Adding missing tests or correcting existing tests |
   | build | 📦 | Changes that affect the build system or external dependencies |
   | ci | ⚙️ | Changes to CI configuration files and scripts |
   | chore | 🔨 | Other changes that don't modify src or test files |
   | revert | ⏪ | Reverts a previous commit |

5. **Generate the commit message**:
   - Format: `<type>(<scope>): <emoji> <description>`
   - Rules:
     - Use lowercase for type and description
     - Keep description under 50 characters when possible
     - Use imperative mood ("add" not "added" or "adds")
     - Include scope when relevant (component, module, or area affected)
     - Place emoji after the colon, before the description
     - No period at the end of the description

6. **Execute the commit**:
   - Run: `but commit -m '<commit-message>' <branch-name>`
   - If there are multiple branches, the branch name/ID is required

7. **Report the result**:
   - On success: Report the commit hash and message
   - On failure: Report the error and suggest fixes

## Commit Type Detection Guidelines

Determine type based on file paths and changes:
- `test/*`, `*.test.*`, `*.spec.*` → `test`
- `docs/*`, `*.md`, `README*` → `docs`
- `package.json`, `build.*`, `Makefile`, `*.gradle` → `build`
- `.github/*`, `.gitlab-ci.yml`, `Jenkinsfile` → `ci`
- New files with new functionality → `feat`
- Modifications fixing issues → `fix`
- Code restructuring without behavior change → `refactor`
- Performance improvements → `perf`
- Formatting, whitespace, linting → `style`

## Example Usage

```bash
# With branch name
/but-commit user-authentication

# Without branch name (will prompt)
/but-commit
```

## Example Output

```
Analyzing changes...
Found 3 modified files in src/auth/

Commit type: feat (new feature)
Scope: auth
Description: add user login functionality

Executing: but commit -m "feat(auth): ✨ add user login functionality" user-authentication

Created commit a1b2c3d on branch user-authentication
```

Execute these steps and provide a summary of the commit operation.
