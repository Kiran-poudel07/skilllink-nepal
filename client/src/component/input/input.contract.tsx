import type { ReactNode } from "react";

export interface ITextInputComponent {
  name: string;
  control: any
  label?: string;
  placeholder?: string;
  errorMessage?: string | null;
  // className:string | any
}

export interface ISelectInputComponent extends ITextInputComponent {
  options: { label: string; value: string }[];
}

export interface IDateInputComponent extends ITextInputComponent {}

export interface IPasswordInputComponent extends ITextInputComponent {}

export interface ISingleOptionType{
    label: string,
    value: string
}
export interface IMultipleOptionsProps extends ITextInputComponent {
    options: Array<ISingleOptionType>
}
export interface IShowErrorMessage {
  children: ReactNode;
}
