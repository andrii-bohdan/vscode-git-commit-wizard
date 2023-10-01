import { gitRepositories } from "./utils/git";
import { activateExtension } from "./extension/index";
import {
  EXTENSION_COMMAND_NAME,
  EXTENSION_SHOW_SCM_ICON,
  EXTENSION_SHOW_STATUS_BAR_ICON,
} from "./config/index";
import * as vscode from "vscode";
import { openGitCommand, createStatusBar } from "./command";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "git-commit-wizard" is now active!'
  );

  const statusBarItem = createStatusBar();

  let disposable = vscode.commands.registerCommand(
    EXTENSION_COMMAND_NAME,
    (uri) => {
      setTimeout(async () => {
        await openGitCommand();

        const repositories = await gitRepositories();
        await activateExtension(repositories, uri);
      }, 200);
    }
  );

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(EXTENSION_SHOW_SCM_ICON)) {
      const updatedShowIconsInSCMTitle = vscode.workspace
        .getConfiguration()
        .get(EXTENSION_SHOW_SCM_ICON);

      if (updatedShowIconsInSCMTitle) {
        vscode.commands.executeCommand(
          "setContext",
          "git-commit-wizard:enableSCMIcon",
          true
        );
      } else {
        vscode.commands.executeCommand(
          "setContext",
          "git-commit-wizard:enableSCMIcon",
          false
        );
      }
    }
    if (event.affectsConfiguration(EXTENSION_SHOW_STATUS_BAR_ICON)) {
      const showStatusBarIcon = vscode.workspace
        .getConfiguration()
        .get(EXTENSION_SHOW_STATUS_BAR_ICON);

      if (showStatusBarIcon) {
        statusBarItem.show();
      } else {
        statusBarItem.hide();
      }
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
