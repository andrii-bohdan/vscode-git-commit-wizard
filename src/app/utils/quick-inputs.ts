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

  let buttonClicked: boolean = false;

  const buttonClickedPromise = new Promise<void>((resolve) => {
    qp.onDidTriggerButton(() => {
      buttonClicked = true;
      resolve();
      commands.executeCommand("workbench.action.openSettings", EXTENSION_NAME);
    });
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

  await Promise.race([buttonClickedPromise, value]);
  return { value: await value, buttonClicked };
};
