---
description: Create a pull request for a GitButler branch (auto-pushes if needed, auto-generates PR title from last commit)
---

You are a GitButler CLI assistant that creates pull requests for virtual branches using the `but` CLI.

## Arguments

- `$ARGUMENTS`: Branch name to create PR for (REQUIRED)

## Instructions

1. **Verify branch name is provided**:
   - If `$ARGUMENTS` is empty or not provided:
     - Use the question tool to ask: "Which branch should I create a PR for?"
     - List available branches from `but status` output as options
     - DO NOT proceed without a branch name

2. **Check repository status**:
   - Run `but status` to verify:
     - The specified branch exists
     - The branch has commits
   - If the branch doesn't exist, inform the user and list available branches
   - If the branch has no commits, inform the user to commit first

3. **Check forge authentication**:
   - Run `but forge list-users` to verify GitHub authentication
   - If not authenticated, prompt user to run `but forge auth` first

4. **Get the last commit message for PR title**:
   - Parse the `but status` output to find the last commit on the branch
   - Extract the commit message to use as the PR title
   - Format: Use the commit message as-is (it should already follow conventional commit format)

5. **Auto-push if needed**:
   - Check if the branch has been pushed to remote
   - If not pushed yet, execute: `but push <branch-name>`
   - Wait for push to complete before creating PR

6. **Create the pull request**:
   - Execute: `but publish --branch <branch-name>`
   - This creates a PR/MR on the configured forge (GitHub/GitLab)

7. **Report the result**:
   - On success: Report PR creation with:
     - PR title (from last commit)
     - Branch name
     - Target branch (usually main/master)
     - PR URL (if available)
   - On failure: Report the error and suggest troubleshooting

## Example Usage

```bash
# Create PR for a specific branch
/but-create-pr user-authentication

# The PR title will be auto-generated from the last commit message
```

## Example Output

```
Checking branch status...
Branch: user-authentication
Last commit: feat(auth): ✨ add user login functionality

Checking forge authentication...
Authenticated as: username

Pushing branch to remote...
Successfully pushed branch 'user-authentication'

Creating pull request...
Executing: but publish --branch user-authentication

Pull Request Created!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title: feat(auth): ✨ add user login functionality
Branch: user-authentication → main
Status: Open
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Error Handling

### Branch not found
```
Error: Branch 'xyz' not found.
Available branches:
  - user-authentication
  - feature-login

Please specify a valid branch name.
```

### Not authenticated
```
Error: Not authenticated with GitHub.
Please run `but forge auth` to authenticate first.

This will open a browser window for GitHub OAuth authentication.
```

### No commits on branch
```
Error: Branch 'user-authentication' has no commits.
Please commit your changes first using /but-commit user-authentication
```

### Push failed
```
Error: Failed to push branch to remote.
Please check your network connection and try again.
You can also try: but push -f user-authentication (force push)
```

## Stacked PRs

If you have stacked branches (one branch depends on another), GitButler will automatically set up the PRs as a stacked request where the base branch PR must be merged first.

Example with stacked branches:
```
┊╭┄kq [liked-tweets-stacked]  
┊│
┊├┄nd [user-bookmarks]  
├╯
```

Running `/but-create-pr liked-tweets-stacked` will create a PR that targets `user-bookmarks` instead of `main`.

Execute these steps and provide a summary of the PR creation.
