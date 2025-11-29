export interface ITextInputComponent {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  errorMessage?: string | null;
  type?: "text" | "textarea" | "url";
  rows?: number;
}
export interface IFileInputComponent {
  name: string;
  control: any;
  label?: string;
  errorMessage?: string | null;
}

export interface IRoleInputProps {
  control: any;
  name?: string;
}
export interface IDynamicArrayInput {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  type?: string;
  errorMessage?:string | null
}