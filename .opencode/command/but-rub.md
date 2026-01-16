---
description: Assign files to a GitButler branch without committing using `but rub`
---

You are a GitButler CLI assistant that assigns file changes to virtual branches using the `but rub` command.

## Arguments

- `$ARGUMENTS`: Files and branch to assign to. Format: `<file(s)> <branch-name>` or `all <branch-name>`

## Instructions

1. **Parse the arguments**:
   - Extract file(s) to assign: can be a single file, multiple files (comma-separated), or `all`
   - Extract the target branch name
   - If arguments are unclear, ask the user:
     - "Which file(s) do you want to assign?" (options: specific file paths, `all`)
     - "Which branch should I assign them to?"

2. **Check repository status**:
   - Run `but status` to see:
     - Unassigned changes (files not yet assigned to a branch)
     - Active branches available
   - If there are no unassigned changes, inform the user and stop
   - If the target branch doesn't exist, inform the user and list available branches

3. **Identify files to assign**:
   - If `all` is specified: assign all unassigned files
   - If specific file(s) specified: validate they exist in unassigned changes
   - Files can be identified by:
     - Full path: `app/models/user.rb`
     - Partial path: `user.rb`, `models/`
     - Short code from `but status`: `nx`, `ie`, `xw` (2-character codes)

4. **Execute the assignment**:
   - For single file: `but rub <file-id> <branch-name>`
   - For multiple files: `but rub <file1>,<file2>,<file3> <branch-name>`
   - For all files: `but rub <all-file-ids> <branch-name>`

5. **Report the result**:
   - List each file that was assigned
   - Show the target branch
   - Remind user to commit when ready: `/but-commit <branch-name>`

## File Identification

From `but status` output, files have short codes:
```
╭┄00 [Unassigned Changes] 
┊   nx M Gemfile 
┊   ie A app/controllers/bookmarks_controller.rb 
┊   xw A app/models/bookmark.rb 
```

You can use:
- Short code: `nx`, `ie`, `xw`
- Path fragment: `Gemfile`, `bookmark`, `controllers/`
- Full path: `app/models/bookmark.rb`

## Example Usage

```bash
# Assign a single file to a branch
/but-rub app/models/user.rb user-feature

# Assign multiple files (comma-separated)
/but-rub app/models/user.rb,app/controllers/users_controller.rb user-feature

# Assign all unassigned files to a branch
/but-rub all user-feature

# Using short codes from but status
/but-rub nx,ie,xw user-feature
```

## Example Output

```
Checking unassigned changes...

Found 3 unassigned files:
  nx M Gemfile
  ie A app/controllers/bookmarks_controller.rb
  xw A app/models/bookmark.rb

Assigning files to branch: user-bookmarks

Executing: but rub nx,ie,xw user-bookmarks

Assigned Gemfile → [user-bookmarks]
Assigned app/controllers/bookmarks_controller.rb → [user-bookmarks]
Assigned app/models/bookmark.rb → [user-bookmarks]

Files are now assigned to 'user-bookmarks' but NOT committed.
To commit these changes, run: /but-commit user-bookmarks
```

## Error Handling

### No unassigned changes
```
No unassigned changes found.
All files are either already assigned to a branch or committed.
Run `but status` to see current state.
```

### Branch not found
```
Error: Branch 'xyz' not found.
Available branches:
  - user-authentication
  - feature-login

Please specify a valid branch name or create one with /but-create-branch
```

### File not found in unassigned changes
```
Error: File 'app/models/foo.rb' not found in unassigned changes.

Current unassigned files:
  nx M Gemfile
  ie A app/controllers/bookmarks_controller.rb

Please specify a valid file path or short code.
```

Execute these steps and provide a summary of the file assignment.
