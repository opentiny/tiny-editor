export interface OperationMenuItem {
  id: string;
  text: string;
  icon?: string;
}

export interface ResultMenuItem {
  text: string;
  icon: string;
  selectText?: string;
}

export interface AIOptions {
  host?: string;
  apiKey: string;
  model?: string;
  contentMaxLength?: number;
}