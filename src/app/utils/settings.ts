import { EXTENSION_NAME } from "./../config/index";
import { workspace } from "vscode";
import {
  InputSettings,
  DefaultCommits,
  CommitOptions,
} from "../../commons/typings/settings";
import { CountryFlags } from "./spelling";

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

export const getSpellCheckSettings = (): boolean => {
  const spellCheckSettings = workspace
  .getConfiguration(EXTENSION_NAME)
  .get("enableSpellCheck");

  return spellCheckSettings as boolean;
};


export const getSpellCheckLocaleSettings = ():CountryFlags => {
  const spellCheckLocaleSettings = workspace
  .getConfiguration(EXTENSION_NAME)
  .get("spellCheckLocale");

  return spellCheckLocaleSettings as CountryFlags;
};


