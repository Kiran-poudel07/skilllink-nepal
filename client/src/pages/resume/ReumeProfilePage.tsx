import { useForm } from "react-hook-form";
import { TextInputContent, DynamicArrayInput, FileInputContent, RoleInputContent } from "../student/StudentInputComponent";
import { StudentResumeDefaultValues, ResumeStudentDTO, type IResumeStudent } from "../contract/resume.contract";
import { yupResolver } from "@hookform/resolvers/yup";
import resumeSvc from "../../services/resume.service";
import { toast } from "sonner"
import { NavLink } from "react-router";

const StudentResumePage = () => {
  const { control, handleSubmit, formState: { errors }, setError, watch } = useForm<IResumeStudent>({
    defaultValues: StudentResumeDefaultValues,
    resolver: yupResolver(ResumeStudentDTO) as any
  });
  const submitForm = async (data: IResumeStudent) => {
    try {
      const resumeData = {
        ...data,
      }
      console.log(resumeData)
      await resumeSvc.submitStudentResume(resumeData,)
      // console.log(response)
      // navigate('/')
      toast.success("you sucessfully upload the resume with us")
      // navigate('/')
      // eslint-disable-next-line
    } catch (exception: any) {
      toast.error("cannot upload resume  at the moment")
      if (exception.code === 400) {
        Object.keys(exception.error.error).forEach((field) => {
          setError(field as keyof IResumeStudent, { message: exception.error.error[field] });
        })
      }
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full px-10 py-8 bg-white-50">
        <div className="flex gap-3 w-full justify-end mb-2">
          <NavLink
            to="/student/dashboard"
            className="
            flex items-center gap-1 px-3 py-1 
            text-sm font-medium rounded-lg 
            border border-gray-300 bg-gray-100 
            hover:bg-green-500 hover:text-white 
            transition-all duration-300
          "
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            Back
          </NavLink>

          <NavLink
            to="/student/resume"
            className="
            flex items-center gap-1 px-3 py-1 
            text-sm font-medium rounded-lg 
            border border-gray-300 bg-gray-100
            hover:bg-green-500 hover:text-white 
            transition-all duration-300
          "
          >
            <i className="fa-solid fa-eye text-xs"></i>
            View
          </NavLink>
        </div>
        <h2 className="text-4xl font-semibold text-gray-800 underline text-center">Student Resume</h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          onSubmit={handleSubmit(submitForm)}
        >
          <div className="flex flex-col gap-5">
            <RoleInputContent control={control} />

            <TextInputContent
              name="bio"
              control={control}
              label="Bio"
              type="textarea"
              rows={4}
              placeholder="Brief summary..."
              errorMessage={errors?.bio?.message as any}
            />

            <TextInputContent
              name="education"
              control={control}
              label="Education"
              placeholder="B.E. in Computer Engineering"
              errorMessage={errors?.education?.message as any}
            />

            <TextInputContent
              name="experience"
              control={control}
              label="Experience"
              type="textarea"
              rows={3}
              placeholder="6-month internship..."
              errorMessage={errors?.experience?.message as any}
            />

            <DynamicArrayInput
              name="skills"
              control={control}
              label="Skills"
              placeholder="Skill"
              type="text"
            />

            <DynamicArrayInput
              name="portfolioLinks"
              control={control}
              label="Portfolio Links"
              placeholder="Portfolio URL"
              type="url"
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-8 bg-gray-50 rounded-xl shadow-inner py-8 px-4">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-teal-300 shadow-md flex items-center justify-center bg-white">
                  {watch("avatar") ? (
                    <img
                      src={
                        typeof watch("avatar") === "string"
                          ? watch("avatar")
                          : URL.createObjectURL(watch("avatar") as File)
                      }
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Avatar</span>
                  )}
                </div>

                <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition">
                  Upload
                  <FileInputContent
                    name="avatar"
                    control={control}
                    label=""
                    errorMessage={errors?.avatar?.message as any}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">Profile Avatar</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-300 shadow-md flex items-center justify-center bg-white">
                  {watch("resume") ? (
                    <img
                      src={
                        typeof watch("resume") === "string"
                          ? watch("resume")
                          : URL.createObjectURL(watch("resume") as File)
                      }
                      alt="Resume Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Resume</span>
                  )}
                </div>

                <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition">
                  Upload
                  <FileInputContent
                    name="resume"
                    control={control}
                    label=""
                    errorMessage={errors?.resume?.message as any}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">Resume (Preview)</p>
            </div>
          </div>
          <div className="md:col-span-2 flex items-center justify-center mt-6">
            <button
              type="submit"
              className="w-10px p-3 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition mb-5"
            >
              Save Resume
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default StudentResumePage;
