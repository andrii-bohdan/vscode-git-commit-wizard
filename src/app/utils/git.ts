import { Repository } from "../../commons/typings/git";
import { extensions, window } from "vscode";

export const gitRepositories = async () => {
  const gitExtension = await extensions.getExtension("vscode.git")?.exports;
  if (!gitExtension.enabled) {
    window.showErrorMessage("Git extension is currently not enabled!");
  }

  const repositories: Repository[] = await gitExtension.getAPI(1).repositories;
  if (!repositories.length) {
    window.showErrorMessage("Couldn't find repositories!");
    throw new Error("Couldn't find repositories");
  }

  return repositories;
};
