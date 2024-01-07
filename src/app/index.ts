import { gitRepositories } from "./utils/git";
import { activateExtension } from "./extension/index";
import {
  EXTENSION_COMMAND_NAME,
  EXTENSION_SHOW_SCM_ICON,
  EXTENSION_SHOW_STATUS_BAR_ICON,
} from "./config/index";
import * as vscode from "vscode";
import { openGitCommand, createStatusBar } from "./command";

export async function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "git-commit-wizard" is now active!'
  );

  const statusBarItem = createStatusBar();
  const workspaceFolders = vscode.workspace.workspaceFolders?.[0];

  checkWorkspaceFolder(statusBarItem, workspaceFolders);

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
        enableScmIcon(true);
      } else {
        enableScmIcon(false);
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

async function checkWorkspaceFolder(
  statusBar: vscode.StatusBarItem,
  workspaceFolders?: vscode.WorkspaceFolder
) {
  const entries = await vscode.workspace.fs.readDirectory(
    workspaceFolders!.uri
  );
  const subfolders = entries
    .filter((entry) => entry[1] === vscode.FileType.Directory)
    .map((entry) => entry[0]);

  if (!entries.length) {
    enableScmIcon(false);
    statusBar.hide();
  }

  const gitPresent = entries.some(([entryName]) => entryName === ".git");

  if (subfolders.length > 0 && !gitPresent) {
    for (const subfolder of subfolders) {
      const subfolderUri = vscode.Uri.joinPath(
        workspaceFolders!.uri,
        subfolder
      );
      const subfolderEntries = await vscode.workspace.fs.readDirectory(
        subfolderUri
      );
      const gitPresentInSubFolder = subfolderEntries.some(
        ([entryName]) => entryName === ".git"
      );
      if (!gitPresentInSubFolder) {
        enableScmIcon(false);
        statusBar.hide();
      }
      enableScmIcon(true);
    }
  } else {
    const gitPresent = entries.some(([entryName]) => entryName === ".git");
    if (!gitPresent) {
      enableScmIcon(false);
      statusBar.hide();
    }
  }
}

function enableScmIcon(active: boolean) {
  vscode.commands.executeCommand(
    "setContext",
    "git-commit-wizard:enableSCMIcon",
    active
  );
}

export function deactivate() {}
