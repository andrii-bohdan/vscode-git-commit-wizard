import { EXTENSION_COMMAND_NAME } from "../../config/index";
import { StatusBarAlignment, window } from "vscode";

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
};
