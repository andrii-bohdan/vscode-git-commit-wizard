import { QuickPickItem } from "vscode";

export interface QuickPickSettings
  extends Omit<QuickPickItem, "key" | "detail"> {
  detail?: string;
}

export interface VariableDetails {
  [key: string]: QuickPickSettings[];
}

export interface Variable {
  key: string;
  value: string;
}

export interface DefaultValue {
  label: string;
  value: string;
}
export interface DefaultValueSettings {
  [key: string]: DefaultValue[];
}

export interface DefaultPromptOption {
  title: string;
  placeholder?: string;
}

export interface DefaultPromptSettings {
  [key: string]: DefaultPromptOption;
}
