import { Repository } from "../../commons/typings/git";
import {
  getCommitTemplate,
  getCommitOptions,
  getDefaultCommits,
  getInputSettings,
} from "./../utils/settings";
import { quickPick, quickText } from "../command/action/prompt-action";
import { SelectedRepository } from "../../commons/typings/repository";
import { Commit, InputOption } from "../../commons/typings/settings";
import { expandAllRepository } from "../command";
import {
  extractRepositoryLabel,
  extractDefaultCommit,
  templateParser,
  templateSerializer,
} from "../utils/mapper";

export const activateExtension = async (
  repositories: Repository[],
  uri: any
) => {
  const commitReplacements: Commit[] = [];
  let selectedRepo: SelectedRepository | string;
  let storedLabel: string | undefined;
  const template = getCommitTemplate() || "{prefix}: {message}";
  const variables = templateParser(template);
  const commitOptions = getCommitOptions();
  const configDefaultCommits = getDefaultCommits();
  const inputOptions = getInputSettings();
  const labelRepository = await extractRepositoryLabel(repositories);

  if (!uri) {
    if (labelRepository.length > 1) {
      const { title = "Repository", placeholder } = inputOptions["repository"];
      selectedRepo = await quickPick(
        {
          title,
          ignoreFocusOut: false,
          placeHolder: placeholder || "Please select a repository",
        },
        labelRepository
      );
      await expandAllRepository();
    }
  }

  for (let i = 0; i < variables.length; i++) {
    const v = variables[i];
    const commitList = commitOptions[v];

    let result: Commit = {
      key: v,
      value: "",
    };

    const defaultCommit = extractDefaultCommit(
      configDefaultCommits[v],
      storedLabel
    );
    const { title = v, placeholder }: InputOption = inputOptions[v];

    if (!commitList) {
      const inputText = await quickText({
        title,
        placeHolder: placeholder || `Enter the <${v}> of the commit`,
        ignoreFocusOut: false,
        value: defaultCommit,
        prompt: !!defaultCommit
          ? `The default value is: "${defaultCommit}"`
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

  if (commitReplacements.length >= variables.length) {
    const commitMessage = templateSerializer(template, commitReplacements);
    if (uri) {
      const uriPath = uri._rootUri?.path || uri.rootUri.path;
      const selectedRepository = repositories.find((repository) => {
        return repository.rootUri.path === uriPath;
      });

      if (selectedRepository) {
        writeCommit(selectedRepository, commitMessage);
      }
    } else {
      const selectedRepository =
        labelRepository.find((r: any) => r.label === selectedRepo) ??
        labelRepository[0];
      writeCommit(selectedRepository, commitMessage);
    }
  }
};

function writeCommit(repository: Repository, message: string) {
  repository.inputBox.value = message;
}
