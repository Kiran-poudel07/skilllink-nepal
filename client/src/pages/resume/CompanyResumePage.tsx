import { useForm } from "react-hook-form";
import { TextInputContent, FileInputContent, RoleInputContent } from "../employer/EmployerInputcomponent"; // reuse input components
import { motion } from "framer-motion";
import { toast } from "sonner"
import { EmployerResumeDefaultValues, ResumeEmployerDTO, type IResumeEmployer } from "../contract/resume.contract";
import resumeSvc from "../../services/resume.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink } from "react-router";

const CompanyResumePage = () => {

  const { control, handleSubmit, formState: { errors }, setError, watch } = useForm<IResumeEmployer>({
    defaultValues: EmployerResumeDefaultValues,
    resolver: yupResolver(ResumeEmployerDTO) as any
  });
  const submitForm = async (data: IResumeEmployer) => {
    try {
      const resumeData = {
        ...data,
      }
      console.log(resumeData)
      await resumeSvc.submitEmployerResume(resumeData)
      // console.log(response)
      // navigate('/')
      toast.success("you sucessfully upload the resume with us")
      // navigate('/')
      // eslint-disable-next-line
    } catch (exception: any) {
      toast.error("cannot upload resume  at the moment")
      if (exception.code === 400) {
        Object.keys(exception.error.error).forEach((field) => {
          setError(field as keyof IResumeEmployer, { message: exception.error.error[field] });
        })
      }
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full px-10 py-8 bg-white-500 animate-fadeIn">
        <div className="flex justify-between w-full gap-3">
          <NavLink
            to="/employer"
            className="
      flex items-center justify-center gap-2 
      px-3 py-2 text-sm font-semibold rounded-lg
      bg-gray-200 text-gray-800 
      hover:bg-gray-300 hover:shadow-md
      transition-all duration-300
    "
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth="2" stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </NavLink>

          <NavLink
            to="/employer/companyresume"
            className="
      flex items-center justify-center gap-2 
      px-3 py-2 text-sm font-semibold rounded-lg
      bg-blue-600 text-white
      hover:bg-blue-700 hover:shadow-md
      transition-all duration-300
    "
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth="2" stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            View Resume
          </NavLink>
        </div>

        <motion.h2
          className="text-4xl font-bold text-center inline-block text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 border-b-2 border-pink-500"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Company Resume
        </motion.h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          onSubmit={handleSubmit(submitForm)}
        >
          <motion.div
            className="flex flex-col gap-5"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <RoleInputContent control={control} />

            <TextInputContent
              name="companyName"
              control={control}
              label="Company Name"
              placeholder="Tech Solutions Pvt Ltd"
              errorMessage={errors?.companyName?.message as any}
            />

            <TextInputContent
              name="companyDescription"
              control={control}
              label="Company Description"
              type="textarea"
              rows={4}
              placeholder="Software & IT consulting"
              errorMessage={errors?.companyDescription?.message as any}
            />

            <TextInputContent
              name="companyAddress"
              control={control}
              label="Address"
              placeholder="Kathmandu, Nepal"
              errorMessage={errors?.companyAddress?.message as any}
            />

            <TextInputContent
              name="contactInfo"
              control={control}
              label="Contact Info"
              placeholder="+9779812345678"
              errorMessage={errors?.contactInfo?.message as any}
            />

            <TextInputContent
              name="category"
              control={control}
              label="Industry Category"
              placeholder="IT"
              errorMessage={errors?.category?.message as any}
            />
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center gap-8 bg-indigo-600/6 rounded-xl shadow-lg py-8 px-6 hover:shadow-2xl transition-all duration-500"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-indigo-400 shadow-lg flex items-center justify-center bg-white animate-pulse">
                  {watch("companyLogo") ? (
                    <img
                      src={
                        typeof watch("companyLogo") === "string"
                          ? watch("companyLogo")
                          : URL.createObjectURL(watch("companyLogo") as File)
                      }
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Logo</span>
                  )}
                </div>

                <label className="absolute inset-0 bg-indigo-600/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm cursor-pointer transition">
                  Upload Logo
                  <FileInputContent
                    name="companyLogo"
                    control={control}
                    label=""
                    errorMessage={errors?.companyLogo?.message as any}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">Company Logo</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-44 h-44 rounded-xl overflow-hidden border-4 border-pink-400 shadow-lg flex items-center justify-center bg-white animate-bounce">
                  {watch("companyDocs") ? (
                    <img
                      src={
                        typeof watch("companyDocs") === "string"
                          ? watch("companyDocs")
                          : URL.createObjectURL(watch("companyDocs") as File)
                      }
                      alt="Company Docs"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Docs</span>
                  )}
                </div>

                <label className="absolute inset-0 bg-pink-600/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm cursor-pointer transition">
                  Upload Docs
                  <FileInputContent
                    name="companyDocs"
                    control={control}
                    label=""
                    errorMessage={errors?.companyDocs?.message as any}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">Company Documents</p>
            </div>
          </motion.div>

          <div className="md:col-span-2 flex items-center justify-center mt-6">
            <motion.button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white mb-6 font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Employer Profile
            </motion.button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CompanyResumePage;
