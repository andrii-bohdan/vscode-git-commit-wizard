import { EXTENSION_NAME } from "./../config/index";
import { workspace } from "vscode";
import {
  DefaultPromptSettings,
  DefaultValueSettings,
  VariableDetails,
} from "../typings/settings";

export const getTemplate = () => {
  const template: string[] | undefined = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("template");

  return template?.join("\n") as string;
};

export const getVariables = () => {
  const variable: VariableDetails | undefined = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("variables");

  return variable as VariableDetails;
};

export const getDefaultValuesSettings = (): DefaultValueSettings => {
  const defaultValues = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("defaultValues");

  return defaultValues as DefaultValueSettings;
};

export const getDefaultPromptSettings = (): DefaultPromptSettings => {
  const commitInputOptions = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("defaultPromptOptions");

  return commitInputOptions as DefaultPromptSettings;
};
