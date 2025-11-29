import { Controller, useFieldArray } from "react-hook-form";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import type { IFileInputComponent, ITextInputComponent,IDynamicArrayInput,IRoleInputProps } from "./studentConstant";
import ShowErrorMessage from "../../component/input/showErrorMessage";
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

export const DynamicArrayInput = ({
  name,
  control,
  label,
  placeholder,
  type = "text",
  errorMessage=null
}: Readonly<IDynamicArrayInput>) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="flex w-full">
      <label className="w-1/3 font-medium text-gray-700">{label}:</label>
      <div className="w-2/3 flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Controller
              name={`${name}.${index}`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type={type}
                  placeholder={`${placeholder} ${index + 1}`}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-800"
              >
                <AiOutlineDelete size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => append("")}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium mt-1"
        >
          <AiOutlinePlus /> Add {label.slice(0, -1)}
        </button>
        <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
      </div>
    </div>
  );
};

export const RoleInputContent = ({ control, name = "role" }: IRoleInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue="student"
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
