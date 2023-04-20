import { QuickPickItem } from "vscode";
import { Repository } from "./git";

export interface RepositoryList extends Repository {
  label: string;
}
export type SelectedRepository = QuickPickItem | RepositoryList | undefined;
