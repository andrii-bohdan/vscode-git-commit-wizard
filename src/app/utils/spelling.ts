import * as simpleSpellchecker from "simple-spellchecker";
import * as vscode from "vscode";
import {
  getSkippedWords,
  getSpellCheckLocaleSettings,
  getSpellCheckSettings,
} from "./settings";

export type ParamsValidationInput =
  | string
  | vscode.InputBoxValidationMessage
  | Thenable<string | vscode.InputBoxValidationMessage | null | undefined>
  | null
  | undefined;

export enum CountryFlags {
  enUS = "en-US",
  itIT = "it-IT",
  frFR = "fr-FR",
  esES = "es-ES",
}

export async function getDictionary(locale: CountryFlags) {
  return new Promise<any | null>((resolve) => {
    simpleSpellchecker.getDictionary(locale, (err: any, dictionary: any) => {
      if (err) {
        vscode.window.showErrorMessage("Error loading dictionary: " + err);
        resolve(null);
      } else {
        resolve(dictionary);
      }
    });
  });
}

export function checkSpelling(message: string, dictionary: any): string[] {
  const customDictionary = getSkippedWords();
  const words = message.match(/[\w']+/g) || [];
  const filteredWords = words.filter(
    (word) => !dictionary.spellCheck(word) && !customDictionary.includes(word)
  );
  return filteredWords;
}

export async function spellCheck(params: vscode.InputBoxOptions) {
  try {
    const enableSpellCheck = getSpellCheckSettings();
    if (!enableSpellCheck) {
      return null;
    }

    const spellCheckLocale = getSpellCheckLocaleSettings() || CountryFlags.enUS;
    const dictionary = await getDictionary(spellCheckLocale);

    params.validateInput = (text: string): ParamsValidationInput => {
      const misspelledWords = checkSpelling(text, dictionary);
      if (misspelledWords.length > 0) {
        let result: vscode.InputBoxValidationMessage;
        let suggestions: string[] = [];

        for (const word of misspelledWords) {
          const suggestion = dictionary.getSuggestions(word)[0];
          if (!suggestion) {
            continue;
          }

          suggestions.push(suggestion);
        }

        if (suggestions.length > 0) {
          result = {
            message: `Misspelled words 😱: "${misspelledWords.join(
              ", "
            )}"\u2003Suggestions 😇: "${suggestions.join(", ")}" ?`,
            severity: vscode.InputBoxValidationSeverity.Warning,
          };
        } else {
          result = {
            message: `Misspelled words 😱: ${misspelledWords.join(", ")}`,
            severity: vscode.InputBoxValidationSeverity.Warning,
          };
        }

        return result;
      }
      return null;
    };
  } catch (err) {
    console.error("Error validating input: ", err);
  }
}
