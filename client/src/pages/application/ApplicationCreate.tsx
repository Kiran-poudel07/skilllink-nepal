import { NumberInputContent, TextInputContent } from "../../component/input/inputComponent";
import * as Yup from "yup"
import { useForm } from "react-hook-form";
import axiosConfig from "../../config/axios.config";
import { toast } from "sonner"
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router";
import { useEffect } from "react";


interface ICreateApplicationForm {
  gig: string;
  proposalMessage: string;
  expectedRate: undefined;
  coverLetter: string;
  estimatedDuration: string;
}
const ApplicationDefaultVlues: ICreateApplicationForm = {
  gig: "",
  proposalMessage: "",
  expectedRate: undefined,
  coverLetter: "",
  estimatedDuration: ""
}
const applicationDTO = Yup.object({
  gig: Yup.string().required("enter gig ID"),
  proposalMessage: Yup.string().min(10).max(50).required("enter the proposal message"),
  expectedRate: Yup.number().required("enter expected money you are looking"),
  coverLetter: Yup.string().min(30).max(100).required("coverLetter iss required"),
  estimatedDuration: Yup.string().required("enter the duration of work")
})

const CreateApplicationPage = () => {

  const location = useLocation();
  const gigIdFromState = location.state?.gigId || "";

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, setError } = useForm<ICreateApplicationForm>({
    defaultValues: ApplicationDefaultVlues,
    resolver: yupResolver(applicationDTO) as any
  })
  useEffect(() => {
    if (gigIdFromState) {
      setValue("gig", gigIdFromState);
    }
  }, [gigIdFromState, setValue]);

  const onSubmit = async (data: ICreateApplicationForm) => {
    try {
      const appData = {
        ...data,
      }
      console.log(appData)
      await axiosConfig.post("application/", appData);
      toast.success("application created sucessfully")
    } catch (exception: any) {
      console.log("error here")
      if (exception.code === 400) {
        Object.keys(exception.error.error).forEach((field) => {
          setError(field as keyof ICreateApplicationForm, { message: exception.error.error[field] });
        })
      }
    }
  }


  return (
    <>
      <div className="h-screen flex items-center justify-center bg-blue-800/5 rounded-md">
        <div className="w-full max-w-xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 p-8 rounded-2xl shadow-2xl animate-gradient-x">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Create Application
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInputContent
              name="gig"
              control={control}
              placeholder="GigId"
              errorMessage={errors?.gig?.message}
            // readOnly
            // className="w-full p-3 rounded-lg border-2 border-white bg-white/20 placeholder-white text-white focus:outline-none focus:border-yellow-300 transition"
            />
            <TextInputContent
              name="proposalMessage"
              control={control}
              placeholder="Proposal Message"
              // label="proposalMessage"
              errorMessage={errors?.proposalMessage?.message}
            // className="w-full p-3 rounded-lg border-2 border-white bg-white/20 placeholder-white text-white focus:outline-none focus:border-yellow-300 transition"

            />
            <NumberInputContent
              name="expectedRate"
              control={control}
              placeholder="Enter expected amount"
              errorMessage={errors?.expectedRate?.message}
            // className="w-full p-3 rounded-lg border-2 border-white bg-white/20 placeholder-white text-white focus:outline-none focus:border-yellow-300 transition"
            />
            <TextInputContent
              name="coverLetter"
              control={control}
              placeholder="Cover Letter"
              errorMessage={errors?.coverLetter?.message}
            // className="w-full p-3 rounded-lg border-2 border-white bg-white/20 placeholder-white text-white focus:outline-none focus:border-yellow-300 transition"
            />
            <TextInputContent
              name="estimatedDuration"
              control={control}
              placeholder="Estimated Duration"
              errorMessage={errors.estimatedDuration?.message}
            // className="w-full p-3 rounded-lg border-2 border-white bg-white/20 placeholder-white text-white focus:outline-none focus:border-yellow-300 transition"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="
    block
    mx-auto
    w-full sm:w-56 
    py-3 
    rounded-lg 
    bg-lime-500 
    text-white 
    font-semibold
    hover:bg-yellow-400
    disabled:bg-gray-400 
    disabled:cursor-not-allowed
    transition-all duration-300
  "
            >
              Submit Application
            </button>


          </form>
        </div>

        <style>
          {`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 5s ease infinite;
          }
        `}
        </style>
      </div>
    </>
  );
};

export default CreateApplicationPage;
