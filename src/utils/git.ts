import { RepositoryList } from "../typings/repository";
import { Repository } from "./../typings/git.d";
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

export const repoNameMapper = async (
  repositories: Repository[]
): Promise<RepositoryList[]> => {
  const repoNames = repositories.map((repository: Repository) => {
    const repoPath = repository.rootUri.path;
    const repoName = repoPath.substring(repoPath.lastIndexOf("/") + 1);
    return { label: repoName, ...repository };
  });

  return repoNames;
};
