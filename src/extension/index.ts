import { Repository } from "./../typings/git.d";
import {
  getDefaultPromptSettings,
  getDefaultValuesSettings,
  getTemplate,
  getVariables,
} from "./../utils/settings";
import { repoNameMapper } from "../utils/git";
import { quickPick, quickText } from "../command/action/prompt-action";
import { RepositoryList, SelectedRepository } from "../typings/repository";
import {
  Variable,
  DefaultPromptSettings,
  DefaultValueSettings,
  DefaultPromptOption,
} from "../typings/settings";
import { expandAllRepository } from "../command";
import {
  mapDefaultValueByLabel,
  templateParser,
  templateSerializer,
} from "../utils/mapper";

export const activateExtension = async (repositories: Repository[]) => {
  const variableReplacements: Variable[] = [];
  let selectedRepo: SelectedRepository;
  let storedLabel: string | undefined;

  const template = getTemplate() || "{prefix}: {message}";
  const variables = templateParser(template);
  const variablesSettings = getVariables();
  const getDefaultValuesSetting: DefaultValueSettings =
    getDefaultValuesSettings();
  const defaultPromptSettings: DefaultPromptSettings =
    getDefaultPromptSettings();
  const mappedRepository: RepositoryList[] = await repoNameMapper(repositories);

  if (mappedRepository.length > 1) {
    const { title = "Repository", placeholder } =
      defaultPromptSettings["repository"];

    selectedRepo = await quickPick(
      {
        title,
        ignoreFocusOut: true,
        placeHolder: placeholder || "Please select a repository",
      },
      mappedRepository.map((r: any) => r.label).reverse()
    );
    await expandAllRepository();
  } else {
    selectedRepo = mappedRepository[0];
  }

  const repositoryList: RepositoryList =
    mappedRepository.find((r: any) => r.label === selectedRepo) ??
    mappedRepository[0];

  for (let i = 0; i < variables.length; i++) {
    const v = variables[i];
    const variablesValue = variablesSettings[v];

    let result: Variable = {
      key: v,
      value: "",
    };

    const defaultValuesSettings = getDefaultValuesSetting[v];
    const defaultValue = mapDefaultValueByLabel(
      defaultValuesSettings,
      storedLabel
    );
    const { title = v, placeholder }: DefaultPromptOption =
      defaultPromptSettings[v];

    if (!variablesValue) {
      const inputText = await quickText({
        title,
        placeHolder: placeholder || `Enter the <${v}> of the commit`,
        ignoreFocusOut: true,
        value: defaultValue,
        prompt: !!defaultValue
          ? `The default value is: "${defaultValue}"`
          : undefined,
      });
      result.value = inputText;
    } else {
      const inputList = await quickPick(
        {
          title,
          ignoreFocusOut: true,
          placeHolder:
            placeholder || `Select a commit <${v}> from the following options`,
        },
        variablesValue.map((c) => ({ label: c.label, detail: c.detail ?? "" }))
      );
      storedLabel = inputList?.label;
      result.value = inputList!.label;
    }

    variableReplacements.push(result);
  }

  if (variableReplacements.length >= variables.length) {
    const commitMessage = templateSerializer(template, variableReplacements);
    repositoryList.inputBox.value = commitMessage;
  }
};
