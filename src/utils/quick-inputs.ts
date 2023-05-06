import {
  QuickInputButton,
  QuickPickItem,
  QuickPickOptions,
  ThemeIcon,
  commands,
  window,
} from "vscode";
import { EXTENSION_NAME } from "../config";

export const customQuickPick = async (
  params: QuickPickOptions,
  items: QuickPickItem[]
) => {
  const qp = window.createQuickPick();
  const addButton: QuickInputButton = {
    iconPath: new ThemeIcon("gear"),
    tooltip: "Settings",
  };
  Object.assign(qp, params);

  qp.buttons = [addButton];
  qp.items = items;

  qp.onDidTriggerButton(async (button) => {
    await commands.executeCommand(
      "workbench.action.openSettings",
      EXTENSION_NAME
    );
  });

  const value = new Promise<string>((resolve) => {
    qp.onDidChangeSelection(([{ label }]) => {
      resolve(label);
      qp.hide();
    });

    qp.onDidHide(() => {
      resolve("");
    });

    qp.show();
  });

  return value;
};
