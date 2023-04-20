import { gitRepositories } from "./utils/git";
import { activateExtension } from "./extension/index";
import { EXTENSION_COMMAND_NAME } from "./config/index";
import * as vscode from "vscode";
import { openGitCommand, createStatusBar } from "./command";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "git-commit-wizard" is now active!'
  );

  createStatusBar();

  context.subscriptions.push(
    vscode.commands.registerCommand(EXTENSION_COMMAND_NAME, () => {
      setTimeout(async () => {
        await openGitCommand();
        const repositories = await gitRepositories();
        await activateExtension(repositories);
      }, 200);
    })
  );
}

export function deactivate() {}
