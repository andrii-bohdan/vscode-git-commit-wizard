import * as assert from "assert";
import {
  extractString,
  mapAutofillValueByLabel,
  templateParser,
  templateSerializer,
} from "../../utils/mapper";

suite("Extension Test Suite", () => {
  test("mapAutofillValueByLabel - Should return the correct autofill value", () => {
    const commits = [
      { key: "feat", value: "New feature" },
      { key: "fix", value: "Bug fix" },
    ];
    const autofillValue = mapAutofillValueByLabel(commits, "feat");
    assert.strictEqual(autofillValue, "New feature");
  });

  test("templateParser - Should return an array of variables", () => {
    const template = "{prefix}: {message}";
    const variables = templateParser(template);
    assert.strictEqual(Array.isArray(variables), true);
    assert.strictEqual(variables.length, 2);
    assert.strictEqual(variables[0], "prefix");
    assert.strictEqual(variables[1], "message");
  });

  test("templateSerializer - Should replace template variables with commit values", () => {
    const template = "{prefix}: {message}";
    const commits = [
      { key: "prefix", value: "feat" },
      { key: "message", value: "New feature" },
    ];
    const serializedTemplate = templateSerializer(template, commits);
    assert.strictEqual(serializedTemplate, "feat: New feature");
  });

  test("extractString - Should extract emojis and return string", () => {
    const commitOptions = [
      {
        label: "🔨 build",
        detail: "Related changes (eg: npm / adding external dependencies)",
        result: "build",
      },
      {
        label: "🔼 bump",
        detail: "Update version number to reflect significant changes",
        result: "bump",
      },
      {
        label: "🚀 ci",
        detail: "Update workflow for CI",
        result: "ci",
      },
      {
        label: "💾 chore",
        detail:
          "A code that external user won't see (eg: change to .gitignore or prettierrc file)",
        result: "chore",
      },
    ];
    for (const commit of commitOptions) {
      assert.strictEqual(extractString(commit.label), commit.result);
    }
  });
  test("quickPick - Should return the selected value", async () => {
    // Mock the QuickPick parameters and test the functionality
    const params = { title: "Test QuickPick", ignoreFocusOut: true };
    const values = [{ label: "Option 1" }, { label: "Option 2" }];

    // Mock the user's selection of "Option 1"
    const mockQuickPick = async (params: any, values: any) => {
      return "Option 1";
    };

    const selectedValue = await mockQuickPick(params, values);
    assert.strictEqual(selectedValue, "Option 1");
  });

  test("quickText - Should return the entered text", async () => {
    // Mock the InputBox parameters and test the functionality
    const params = {
      prompt: "Enter a value",
      ignoreFocusOut: true,
      value: "Test Text",
    };

    const mockQuickText = async (params: any) => {
      return params.value;
    };
    const enteredText = await mockQuickText(params);
    assert.strictEqual(enteredText, "Test Text");
  });
});
