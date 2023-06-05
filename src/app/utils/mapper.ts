import { Commit } from "../../commons/typings/settings";

export function extractString(str: string | undefined): string {
  const regex = /[\p{L}\p{N}\s]+/u;
  const matches = str?.match(regex);
  if (matches && matches.length > 0) {
    return matches[0].trim();
  }
  return "";
}

export const mapAutofillValueByLabel = (
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

  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    newTemplate = newTemplate.replace(`{${e.key}}`, e.value);
  }

  return newTemplate.trim();
};
