import { Controller } from "react-hook-form";
import ShowErrorMessage from "./showErrorMessage";
import type{ IDateInputComponent } from "./input.contract";
import type { ITextInputComponent } from "./input.contract";
import type { IPasswordInputComponent } from "./input.contract";
import type { ISelectInputComponent } from "./input.contract";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";


export const EmailInputContent = ({
  name,
  control,
  label,
  placeholder,
  errorMessage = null,
}: Readonly<ITextInputComponent>) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              {...field}
              type="email"
              placeholder={placeholder || `Enter ${name}...`}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 
                        focus:ring-blue-500 focus:outline-none"
            />
            <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
          </>
        )}
      />
    </div>
  );
};
export const TextInputContent = ({
  name,
  control,
  label,
  placeholder,
  errorMessage = null,
}: Readonly<ITextInputComponent>) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              {...field}
              type="text"
              placeholder={placeholder || `Enter ${name}...`}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
          </>
        )}
      />
    </div>
  );
};


export const PasswordInputContent = ({
  name,
  control,
  errorMessage = null,
  placeholder,
  label,
}: Readonly<IPasswordInputComponent>) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <div className="relative">
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder || `Enter ${name}...`}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
          </>
        )}
      />
    </div>
  );
};

export const NumberInputContent = ({
  name,
  control,
  label,
  placeholder,
  errorMessage = null,
}: Readonly<ITextInputComponent>) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              {...field}
              type="number"
              placeholder={placeholder || `Enter ${name}...`}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
          </>
        )}
      />
    </div>
  );
};

export const SelectInputContent = ({
  name,
  control,
  options,
  label,
  errorMessage = null,
}: Readonly<ISelectInputComponent>) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <select
              {...field}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
          </>
        )}
      />
    </div>
  );
};

export const RadioInputContent = ({
  name,
  control,
  label,
  options,
  errorMessage = null,
}: Readonly<ISelectInputComponent>) => {
  return (
    <div className="space-y-1">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex gap-4 mt-1">
            {options.map((opt) => (
              <label key={opt.value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  value={opt.value}
                  checked={field.value === opt.value}
                  onChange={() => field.onChange(opt.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      />
      <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
    </div>
  );
};

export const FileInputContent = ({
  name,
  control,
  label,
  errorMessage = null,
}: Readonly<ITextInputComponent>) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              type="file"
              onChange={(e) => field.onChange(e.target.files?.[0])}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
          </>
        )}
      />
    </div>
  );
};

interface OptionObject {
  value: string;
  label: string;
}

interface GigSelect {
  name:string,
  control: any,
  label:string,
  options:(string | OptionObject)[],
  errorMessage:null | string | undefined
}
export const GigSelectInputContent = ({ name, control, label, options, errorMessage = null }:Readonly<GigSelect>) => (
  <div className="flex flex-col gap-1">
    <label className="text-gray-700 font-medium">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <select
          {...field}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        >
          <option value="">Select {label}</option>
          {options.map((opt, idx) =>
            typeof opt === "string" ? (
              <option key={idx} value={opt}>{opt}</option>
            ) : (
              <option key={idx} value={opt.value}>{opt.label}</option>
            )
          )}
        </select>
      )}
    />
    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
);

export const DateInputContent = ({
  name,
  control,
  label,
  errorMessage = null,
}: Readonly<IDateInputComponent>) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              {...field}
              type="date"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
          </>
        )}
      />
    </div>
  );
};
