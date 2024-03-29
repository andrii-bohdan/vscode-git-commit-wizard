import { Repository } from "../../commons/typings/git";
import { RepositoryList } from "../../commons/typings/repository";
import { Commit } from "../../commons/typings/settings";
import { getEmojiSettings } from "./settings";

export function extractString(str: string | undefined): string {
  const regex = /[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]+/gu;
  const matches = str?.match(regex);

  if (matches && matches.length > 0) {
    return matches[0].trim();
  }

  return "";
}

export const extractDefaultCommit = (
  values: Commit[],
  label?: string
): string | undefined => {
  const regexLabel = extractString(label);
  const filteredValue = values
    ?.filter((c: Commit) => c.key === regexLabel)
    .map((v) => v.value)[0];
  return filteredValue;
};

export const templateParser = (template: string): string[] => {
  const matches = [...template.matchAll(/{\s*[\w\.]+\s*}/g)];
  let variables = matches
    .map((e) => e[0].match(/[\w\.]+/g))
    .map((e) => (e ? e[0] : null))
    .filter((e) => e !== null);

  // @ts-ignore
  return variables;
};

export const templateSerializer = (template: string, data: Commit[]) => {
  let newTemplate = template;
  const showEmojis = getEmojiSettings();
  for (let i = 0; i < data.length; i++) {
    const e = data[i];

    if (!showEmojis) {
      e.value = extractString(e.value);
    }

    if (e.key === "scope" && e.value === "") {
      newTemplate = newTemplate.replace(`({${e.key}})`, "");
    }

    newTemplate = newTemplate.replace(`{${e.key}}`, e.value);
  }

  return newTemplate.trim();
};

export const extractRepositoryLabel = async (
  repositories: Repository[]
): Promise<RepositoryList[]> => {
  const repoNames = repositories.map((repository: Repository) => {
    const repoPath = repository.rootUri.path;
    const repoName = repoPath.substring(repoPath.lastIndexOf("/") + 1);
    return { label: repoName, ...repository };
  });

  return repoNames;
};
