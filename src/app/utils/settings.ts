import { EXTENSION_NAME } from "./../config/index";
import { workspace } from "vscode";
import {
  InputSettings,
  AutofillCommits,
  CommitOptions,
} from "../../commons/typings/settings";

export const getCommitTemplate = () => {
  const commitTemplate: string[] | undefined = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("commitTemplate");

  return commitTemplate?.join("\n") as string;
};

export const getCommitOptions = () => {
  const commitOptions: CommitOptions | undefined = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("commitOptions");

  return commitOptions as CommitOptions;
};

export const getAutofillCommits = (): AutofillCommits => {
  const autofillCommits = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("autofillCommits");

  return autofillCommits as AutofillCommits;
};

export const getInputSettings = (): InputSettings => {
  const inputSettings = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("inputSettings");

  return inputSettings as InputSettings;
};
