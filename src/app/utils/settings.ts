import { EXTENSION_NAME } from "./../config/index";
import { workspace } from "vscode";
import {
  InputSettings,
  DefaultCommits,
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

export const getDefaultCommits = (): DefaultCommits => {
  const defaultCommits = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("autofillCommits");

  return defaultCommits as DefaultCommits;
};

export const getInputSettings = (): InputSettings => {
  const inputSettings = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("inputSettings");

  return inputSettings as InputSettings;
};

export const getEmojiSettings = (): boolean => {
  const emojiSettings = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("showEmojis");

  return emojiSettings as boolean;
};
