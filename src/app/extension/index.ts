import { Repository } from "../../commons/typings/git";
import {
  getCommitTemplate,
  getCommitOptions,
  getAutofillCommits,
  getInputSettings,
} from "./../utils/settings";
import { repoNameMapper } from "../utils/git";
import { quickPick, quickText } from "../command/action/prompt-action";
import {
  RepositoryList,
  SelectedRepository,
} from "../../commons/typings/repository";
import {
  Commit,
  AutofillCommits,
  InputOption,
  InputSettings,
} from "../../commons/typings/settings";
import { expandAllRepository } from "../command";
import {
  mapAutofillValueByLabel,
  templateParser,
  templateSerializer,
} from "../utils/mapper";

export const activateExtension = async (repositories: Repository[]) => {
  const commitReplacements: Commit[] = [];
  let selectedRepo: SelectedRepository | string;
  let storedLabel: string | undefined;
  const template = getCommitTemplate() || "{prefix}: {message}";
  const variables = templateParser(template);
  const commitOptions = getCommitOptions();
  const autofillCommitsList: AutofillCommits = getAutofillCommits();
  const inputOptions: InputSettings = getInputSettings();
  const mappedRepository: RepositoryList[] = await repoNameMapper(repositories);

  if (mappedRepository.length > 1) {
    const { title = "Repository", placeholder } = inputOptions["repository"];
    selectedRepo = await quickPick(
      {
        title,
        ignoreFocusOut: false,
        placeHolder: placeholder || "Please select a repository",
      },
      mappedRepository
    );
    await expandAllRepository();
  }

  for (let i = 0; i < variables.length; i++) {
    const v = variables[i];
    const commitList = commitOptions[v];

    let result: Commit = {
      key: v,
      value: "",
    };

    const autofillCommit = mapAutofillValueByLabel(
      autofillCommitsList[v],
      storedLabel
    );
    const { title = v, placeholder }: InputOption = inputOptions[v];

    if (!commitList) {
      const inputText = await quickText({
        title,
        placeHolder: placeholder || `Enter the <${v}> of the commit`,
        ignoreFocusOut: false,
        value: autofillCommit,
        prompt: !!autofillCommit
          ? `The default value is: "${autofillCommit}"`
          : undefined,
      });
      result.value = inputText;
    } else {
      const value = await quickPick(
        {
          title,
          ignoreFocusOut: false,
          placeHolder:
            placeholder || `Select a commit <${v}> from the following options`,
        },
        commitList.map((c) => ({ label: c.label, detail: c.detail ?? "" }))
      );

      storedLabel = value;
      result.value = value || "";
    }

    commitReplacements.push(result);
  }

  const currentRepo: RepositoryList =
    mappedRepository.find((r: any) => r.label === selectedRepo) ??
    mappedRepository[0];

  if (commitReplacements.length >= variables.length) {
    const commitMessage = templateSerializer(template, commitReplacements);
    currentRepo.inputBox.value = commitMessage;
  }
};
