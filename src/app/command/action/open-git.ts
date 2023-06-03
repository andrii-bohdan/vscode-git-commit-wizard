import { commands } from "vscode";

export const openGitCommand = async () => {
  await commands.executeCommand("workbench.view.scm");
};

export const expandAllRepository = async () => {
  await commands.executeCommand("workbench.scm.action.expandAllRepositories");
  await commands.executeCommand("workbench.scm.focus");
};
