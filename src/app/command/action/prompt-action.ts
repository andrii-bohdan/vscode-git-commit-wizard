import {
  InputBoxOptions,
  QuickPickItem,
  QuickPickOptions,
  window,
} from "vscode";

import { customQuickPick } from "../../utils/quick-inputs";
import { spellCheck } from "../../utils/spelling";

export const quickPick = async (
  params: QuickPickOptions,
  values: QuickPickItem[]
) => {
  const { value, buttonClicked } = await customQuickPick(params, values);
  if (!value && !buttonClicked) {
    window.showErrorMessage("Message is cancel");
  }
  if (buttonClicked) {
    throw new Error();
  } else {
    return value;
  }
};

export const quickText = async (params: InputBoxOptions) => {
  await spellCheck(params);

  const input = await window.showInputBox(params);
  if (input === undefined) {
    window.showErrorMessage("Message is cancel");
    throw new Error("Message is cancel");
  }

  return input;
};
