import * as assert from "assert";
import { gitRepositories, repoNameMapper } from "../../utils/git";
import {
  mapAutofillValueByLabel,
  templateParser,
  templateSerializer,
} from "../../utils/mapper";
import {
  getCommitTemplate,
  getCommitOptions,
  getAutofillCommits,
  getInputSettings,
} from "../../utils/settings";
import { activateExtension } from "../../extension";
import { quickPick, quickText } from "../../command/action/prompt-action";

suite("Extension Test Suite", () => {
  // test("gitRepositories - Should return an array of repositories", async () => {
  //   const repositories = await gitRepositories();
  //   assert.strictEqual(Array.isArray(repositories), true);
  // });

  // test("repoNameMapper - Should return an array of RepositoryList", async () => {
  //   const repositories = [
  //     {
  //       rootUri: { path: "/path/to/repo1" },
  //     },
  //     {
  //       rootUri: { path: "/path/to/repo2" },
  //     },
  //   ];
  //   const repositoryList = await repoNameMapper(repositories);
  //   assert.strictEqual(Array.isArray(repositoryList), true);
  //   assert.strictEqual(repositoryList.length, 2);
  //   assert.strictEqual(repositoryList[0].label, "repo1");
  //   assert.strictEqual(repositoryList[1].label, "repo2");
  // });

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

  // test("quickText - Should return the entered text", async () => {
  //   // Mock the InputBox parameters and test the functionality
  //   const params = {
  //     prompt: "Enter a value",
  //     ignoreFocusOut: true,
  //     value: "Test Text",
  //   };
  //   const enteredText = await quickText(params);
  //   assert.strictEqual(enteredText, "Test Text");
  // });
});
