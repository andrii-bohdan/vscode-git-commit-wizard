import {
  InputBoxOptions,
  QuickPickItem,
  QuickPickOptions,
  window,
} from "vscode";

export const quickPick = async (
  params: QuickPickOptions,
  values: QuickPickItem[]
) => {
  const value = await window.showQuickPick(values, params);
  if (!value) {
    window.showErrorMessage("Message is cannot be empty!");
  }
  return value;
};

export const quickText = async (params: InputBoxOptions) => {
  const input = await window.showInputBox(params);
  if (input === undefined) {
    window.showErrorMessage("Message is cannot be empty!");
    throw new Error("Message is cannot be empty!");
  }
  return input;
};
