import emojiRegex from "emoji-regex";
import { DefaultValue, Variable } from "../typings/settings";

export const mapDefaultValueByLabel = (
  values: DefaultValue[],
  label?: string
): string | undefined => {
  const regex = emojiRegex();
  const regexLabel = label?.replace(regex, "").trim();
  const filteredValue = values
    ?.filter((v: DefaultValue) => v.label === regexLabel)
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

export const templateSerializer = (template: string, data: Variable[]) => {
  let newTemplate = template;

  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    newTemplate = newTemplate.replace(`{${e.key}}`, e.value);
  }

  return newTemplate.trim();
};
