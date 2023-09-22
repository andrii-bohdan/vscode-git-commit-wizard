import { EXTENSION_COMMAND_NAME } from "../../config/index";
import { StatusBarAlignment, window, workspace, commands } from "vscode";

export const createStatusBar = () => {
  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Left,
    -100
  );

  statusBarItem.text = "$(mark-github) Git Commit Wizard";
  statusBarItem.tooltip = "Git Commit Wizard";
  statusBarItem.color = "#3ec29a";
  statusBarItem.command = EXTENSION_COMMAND_NAME;
  statusBarItem.show();

  const showIconsInSCMTitle = workspace
    .getConfiguration()
    .get("git-commit-wizard.showIconsInSCMTitle");

  if (showIconsInSCMTitle) {
    commands.executeCommand(
      "setContext",
      "git-commit-wizard:enableSCMIcon",
      true
    );
  }
};
