# Git-Commit-Wizard

![Git Commit Wizard](./assets/git-commit-wizard.gif)

This extension helps users write well-structured commit messages, making it easier to maintain and manage changes to code repositories. With its versatility, it can be used across multiple repositories in source control trees, enabling users to maintain a consistent approach to commit message formatting across their projects.

## Features

- Provides the process of writing a well-structured commit message.
- Allows you to select a commit type from a predefined list based on the package.json file.
- Allows you to enter a commit scope and message to complete the commit message in the standard format.
- Allows working with microservices

## Requirements

Please ensure that the Git extension is enabled in your VS Code environment.

## Extension Settings

This extension contributes the following settings:

`git-commit-wizard.enable`: Enable/disable this extension.

`git-commit-wizard.template`:

An array of strings representing the commit message template. The following placeholders can be used:

- `{prefix}`: The commit message prefix.
- `{scope}`: The commit message scope.
- `{message}`: The commit message message.

Example:

```
{
  "git-commit-wizard.template": [
    "{prefix}({scope}): {message}"
  ]
}

```

`git-commit-wizard.defaultValues`:

An object containing default values for the commit message fields. The following properties can be used:

- `scope`: An array of objects with label and value properties.
- `message`: An array of objects with label and value properties.

Example:

```
{
  "git-commit-wizard.defaultValues": {
    "scope": [
      {
        "label": "feat",
        "value": "my-new-feature"
      }
    ],
    "message": [
      {
        "label": "feat",
        "value": "Add a new feature"
      }
    ]
  }
}

```

`git-commit-wizard.defaultPromptOptions`:

An object containing default options for the commit message prompt. The following properties can be used:

- `repository`: An object with title and placeholder properties.
- `prefix`: An object with title and placeholder properties.
- `scope`: An object with title and placeholder properties.
- `message`: An object with title and placeholder properties.

Example:

```
{
  "git-commit-wizard.defaultPromptOptions": {
    "repository": {
      "title": "Repository",
      "placeholder": "Select a repository from the list (use arrow keys to navigate)"
    },
    "prefix": {
      "title": "Prefix",
      "placeholder": ""
    },
    "scope": {
      "title": "Scope",
      "placeholder": ""
    },
    "message": {
      "title": "Message",
      "placeholder": ""
    }
  }
}

```

`git-commit-wizard.variables`:

An object containing a list of commit message prefixes. Each prefix is represented by an array of objects with label and detail properties.

Example:

```
{
  "git-commit-wizard.variables": {
    "prefix": [
      {
        "label": "feat",
        "detail": "A new feature"
      },
      {
        "label": "fix",
        "detail": "A bug fix"
      },
      {
        "label": "docs",
        "detail": "Documentation changes"
      }
    ]
  }
}

```

## Keyboard Shortcut

This extension also includes a keyboard shortcut to quickly open the commit message scaffold. Use the following shortcut to activate it:

- **Windows / Linux:** `Ctrl+Shift+Enter`
- **macOS:** `Cmd+Shift+Enter`

## Release Notes

### 1.0.0

Initial release of Git-Commit-Wizard.

## Known Issues

There are no known issues at this time.
