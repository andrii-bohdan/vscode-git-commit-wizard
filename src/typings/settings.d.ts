import { QuickPickItem } from "vscode";

export interface QuickPickSettings
  extends Omit<QuickPickItem, "key" | "detail"> {
  detail?: string;
}

export interface CommitOptions {
  [key: string]: QuickPickSettings[];
}

export interface Commit {
  key: string;
  value: string;
}
export interface AutofillCommits {
  [key: string]: Commit[];
}

export interface InputOption {
  title: string;
  placeholder?: string;
}

export interface InputSettings {
  [key: string]: InputOption;
}
