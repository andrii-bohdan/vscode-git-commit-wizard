import {
  EXTENSION_COMMAND_NAME,
  EXTENSION_SHOW_SCM_ICON,
  EXTENSION_SHOW_STATUS_BAR_ICON,
} from "../../config/index";
import { StatusBarAlignment, window, workspace, commands } from "vscode";

export const createStatusBar = () => {
  const showIconsInSCMTitle = workspace
    .getConfiguration()
    .get(EXTENSION_SHOW_SCM_ICON);

  const showStatusBarIcon = workspace
    .getConfiguration()
    .get(EXTENSION_SHOW_STATUS_BAR_ICON);

  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Left,
    -100
  );

  statusBarItem.text = "$(mark-github) Git Commit Wizard";
  statusBarItem.tooltip = "Git Commit Wizard";
  statusBarItem.color = "#3ec29a";
  statusBarItem.command = EXTENSION_COMMAND_NAME;

  if (showIconsInSCMTitle) {
    commands.executeCommand(
      "setContext",
      "git-commit-wizard:enableSCMIcon",
      true
    );
  }

  if (showStatusBarIcon) {
    statusBarItem.show();
  }

  return statusBarItem;
};
