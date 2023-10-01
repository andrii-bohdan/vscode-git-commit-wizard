import {
  ExtensionContext,
  commands,
  window,
  StatusBarAlignment,
  extensions,
  workspace,
  QuickPickOptions,
  QuickPickItem,
  QuickInputButton,
  ThemeIcon,
  InputBoxOptions,
} from "vscode";
import { Repository } from "../commons/typings/git";
import {
  DefaultCommits,
  InputSettings,
  Commit,
  InputOption,
  CommitOptions,
} from "../commons/typings/settings";
import {
  RepositoryList,
  SelectedRepository,
} from "../commons/typings/repository";

//Define const
const EXTENSION_NAME = "git-commit-wizard";
const EXTENSION_COMMAND_NAME = "git-commit-wizard.openCommitMessage";

export function activate(context: ExtensionContext) {
  console.log(
    `Congratulations, your extension "${EXTENSION_NAME}" is now active!`
  );
  createStatusBar();

  context.subscriptions.push(
    commands.registerCommand(EXTENSION_COMMAND_NAME, () => {
      setTimeout(async () => {
        await openGitSection();
        const repositories = await gitRepositories();
        await runExtension(repositories);
      }, 200);
    })
  );
}

async function runExtension(repositories: Repository[]) {
  const commitReplacements: Commit[] = [];
  let selectedRepo: SelectedRepository | string;
  let storedLabel: string | undefined;
  const template = getCommitTemplate() || "{prefix}: {message}";
  const variables = templateParser(template);
  const commitOptions = getCommitOptions();
  const autofillCommitsList = getAutofillCommits();
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
    await expandRepository();
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
}

//mapper

function extractString(str: string | undefined): string {
  const regex = /[\p{L}\p{N}\s]+/u;
  const matches = str?.match(regex);
  if (matches && matches.length > 0) {
    return matches[0].trim();
  }
  return "";
}

function mapAutofillValueByLabel(values: Commit[], label?: string) {
  const regexLabel = extractString(label);
  const filteredValue = values
    ?.filter((c: Commit) => c.key === regexLabel)
    .map((v) => v.value)[0];
  return filteredValue;
}

function templateParser(template: string): string[] {
  const matches = [...template.matchAll(/{\s*[\w\.]+\s*}/g)];
  let variables = matches
    .map((e) => e[0].match(/[\w\.]+/g))
    .map((e) => (e ? e[0] : null))
    .filter((e) => e !== null);

  // @ts-ignore
  return variables;
}
function templateSerializer(template: string, data: Commit[]) {
  let newTemplate = template;

  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    newTemplate = newTemplate.replace(`{${e.key}}`, e.value);
  }

  return newTemplate.trim();
}

//Settings
function getCommitTemplate() {
  const commitTemplate: string[] | undefined = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("commitTemplate");

  return commitTemplate?.join("\n") as string;
}

function getCommitOptions() {
  const commitOptions: CommitOptions | undefined = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("commitOptions");

  return commitOptions as CommitOptions;
}

function getAutofillCommits(): DefaultCommits {
  const autofillCommits = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("autofillCommits");

  return autofillCommits as DefaultCommits;
}

function getInputSettings(): InputSettings {
  const inputSettings = workspace
    .getConfiguration(EXTENSION_NAME)
    .get("inputSettings");

  return inputSettings as InputSettings;
}
// Git
async function gitRepositories(): Promise<Repository[]> {
  const gitExtension = await extensions.getExtension("vscode.git")?.exports;
  if (!gitExtension.enabled) {
    window.showErrorMessage("Git extension is currently not enabled!");
  }

  const repositories = await gitExtension.getAPI(1).repositories;
  if (!repositories.length) {
    window.showErrorMessage("Couldn't find repositories!");
    throw new Error("Couldn't find repositories");
  }

  return repositories;
}
async function repoNameMapper(
  repositories: Repository[]
): Promise<RepositoryList[]> {
  const repoNames = repositories.map((repository: Repository) => {
    const repoPath = repository.rootUri.path;
    const repoName = repoPath.substring(repoPath.lastIndexOf("/") + 1);
    return { label: repoName, ...repository };
  });

  window.showInformationMessage(repoNames[0].label);

  return repoNames;
}

// vscode commands

async function quickPick(params: QuickPickOptions, values: QuickPickItem[]) {
  const { value, buttonClicked } = await customQuickPick(params, values);
  if (!value && !buttonClicked) {
    window.showErrorMessage("Message is cancel");
  }
  if (buttonClicked) {
    throw new Error();
  } else {
    return value;
  }
}

export const quickText = async (params: InputBoxOptions) => {
  const input = await window.showInputBox(params);
  if (input === undefined) {
    window.showErrorMessage("Message is cancel");
    throw new Error("Message is cancel");
  }
  return input;
};

async function customQuickPick(
  params: QuickPickOptions,
  items: QuickPickItem[]
) {
  const qp = window.createQuickPick();
  const addButton: QuickInputButton = {
    iconPath: new ThemeIcon("gear"),
    tooltip: "Settings",
  };
  Object.assign(qp, params);
  qp.buttons = [addButton];
  qp.items = items;

  let buttonClicked: boolean = false;

  const buttonClickedPromise = new Promise<void>((resolve) => {
    qp.onDidTriggerButton(() => {
      buttonClicked = true;
      resolve();
      commands.executeCommand("workbench.action.openSettings", EXTENSION_NAME);
    });
  });

  const value = new Promise<string>((resolve) => {
    qp.onDidChangeSelection(([{ label }]) => {
      resolve(label);
      qp.hide();
    });

    qp.onDidHide(() => {
      resolve("");
    });

    qp.show();
  });

  await Promise.race([buttonClickedPromise, value]);
  return { value: await value, buttonClicked };
}

function createStatusBar() {
  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Left,
    -100
  );

  statusBarItem.text = "$(mark-github) Git Commit Wizard";
  statusBarItem.tooltip = "Git Commit Wizard";
  statusBarItem.color = "#068a36";

  statusBarItem.command = EXTENSION_COMMAND_NAME;
  statusBarItem.show();
}

async function openGitSection() {
  await commands.executeCommand("workbench.view.scm");
}

async function expandRepository() {
  await commands.executeCommand("workbench.scm.action.expandAllRepositories");
  await commands.executeCommand("workbench.scm.focus");
}

export function deactivate() {}
