import { Controller } from "react-hook-form";
import type { IFileInputComponent, ITextInputComponent,IRoleInputProps } from "./EmployerConstant";
export const FileInputContent = ({
  name,
  control,
  label,
  errorMessage = null,
}: Readonly<IFileInputComponent>) => {
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
            {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
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
  placeholder = "",
  errorMessage = null,
  type = "text",
  rows = 3,
}: Readonly<ITextInputComponent>) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === "textarea" ? (
            <textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
            />
          ) : (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
            />
          )
        }
      />
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
    </div>
  );
};


export const RoleInputContent = ({ control, name = "role" }: IRoleInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue="employer"
      render={({ field }) => (
        <div className="flex w-full">
          <label className="w-1/3 font-medium text-gray-700">Role:</label>
          <div className="w-2/3">
            <input
              {...field}
              readOnly
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>
      )}
    />
  );
};
