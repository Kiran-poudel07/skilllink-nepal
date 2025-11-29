import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PageTitle from "../../component/PageTitle";
import { toast } from "sonner";
import { GigSelectInputContent, NumberInputContent, TextInputContent } from "../../component/input/inputComponent";
import { GigDefaultValues, gigDTO, type IGigValues } from "../contract/gig.contract";
import { DynamicArrayInput } from "../student/StudentInputComponent";
import axiosConfig from "../../config/axios.config";
import type { ITextInputComponent } from "../../component/input/input.contract";
import ShowErrorMessage from "../../component/input/showErrorMessage";

export const GigFileInputContent = ({
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
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                field.onChange(files);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <ShowErrorMessage>{errorMessage}</ShowErrorMessage>
          </>
        )}
      />
    </div>
  );
};

export const CreateGigPage = () => {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: GigDefaultValues,
    resolver: yupResolver(gigDTO) as any
  });

  const categories = [
    "Information Technology",
    "Medicine & Healthcare",
    "Education & Tutoring",
    "Agriculture & Farming",
    "Arts & Crafts",
    "Tourism & Hospitality",
    "Construction & Civil Engineering",
    "Automobile & Mechanical",
    "Finance & Accounting",
    "Marketing & Advertising",
    "Legal Services",
    "Media & Journalism",
    "Fashion & Apparel",
    "Food & Beverages",
    "Event Management",
    "Research & Development",
    "Sports & Fitness",
    "Environmental & Sustainability",
    "Science & Technology",
    "Music & Entertainment"
  ];

  const onSubmit = async (data: IGigValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("budget", data.budget.toString());
      formData.append("duration", data.duration);

      data.requiredSkills.forEach(skill => formData.append("requiredSkills[]", skill));

      if (data.files) {
        Array.from(data.files).forEach(file => formData.append("files", file));
      }

      await axiosConfig.post("gig/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Gig created successfully");
    } catch (exception: any) {
      toast.error("Cannot register at the moment");
    }
  };

  // console.log("yes")
  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-white p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl bg-gradient-to-br from-indigo-100 via-white to-purple-100 shadow-xl rounded-2xl p-6 sm:p-8">
          <PageTitle title="Create New Gig" className="text-3xl text-center text-gray-800 mb-6" />
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <TextInputContent name="title" control={control} label="Gig Title" errorMessage={errors.title?.message} placeholder="e.g., Build a MERN Stack Web App" />
            <TextInputContent name="description" control={control} label="Description" errorMessage={errors.description?.message} placeholder="Describe what the gig is about..." />
            <GigSelectInputContent name="category" control={control} label="Category" options={categories} errorMessage={errors.category?.message} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <NumberInputContent name="budget" control={control} label="Budget ($)" errorMessage={errors.budget?.message} placeholder="e.g., 1500" />
              <TextInputContent name="duration" control={control} label="Duration" errorMessage={errors.duration?.message} placeholder="e.g., 2 weeks" />
            </div>

            <DynamicArrayInput name="requiredSkills" control={control} label="Required Skills" errorMessage={errors.requiredSkills?.message} placeholder="e.g., JavaScript, Node.js, React, MongoDB" />
            <GigFileInputContent name="files" control={control} label="Attachments (optional)" errorMessage={null} />

            <div className="flex justify-center pt-4 gap-4">
              <button type="submit" disabled={isSubmitting} className="flex-1 py-3 disabled:bg-yellow-800 disabled:bg-none disabled:text-gray-300 disabled:cursor-not-allowed
      disabled:hover:from-yellow-800 disabled:hover:to-yellow-800 font-semibold text-white rounded-xl bg-indigo-600 hover:bg-indigo-700/30 shadow-lg transition duration-300">
                Create Gig
              </button>
              <button type="button" onClick={() => reset()} disabled={isSubmitting} className="disabled:bg-teal-800/70 disabled:text-gray-200 disabled:cursor-not-allowed
      disabled:bg-none disabled:hover:from-teal-800 disabled:hover:to-teal-800 flex-1 py-3 font-semibold text-gray-800 rounded-xl border border-gray-300 bg-gray-100 hover:bg-gray-200 shadow-lg transition duration-300">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
