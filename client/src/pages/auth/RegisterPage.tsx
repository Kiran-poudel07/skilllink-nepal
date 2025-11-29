import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterDTO, registerDefaultValues, type IRegisterUserData } from "../../pages/auth/auth.contract";
import { TextInputContent, EmailInputContent, PasswordInputContent, FileInputContent, SelectInputContent, RadioInputContent, DateInputContent, NumberInputContent, } from "../../component/input/inputComponent";
import { toast } from "sonner";
import authSvc from "../../services/auth.service";
import { NavLink, useNavigate } from "react-router";
import PageTitle from "../../component/PageTitle";
import { DividerHalf } from "../../component/DividerHalf";


const Register = () => {
  const navigate = useNavigate()
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setError } = useForm<IRegisterUserData>({
    defaultValues: registerDefaultValues,
    resolver: yupResolver(RegisterDTO) as any,
  });

  const onSubmit = async (data: IRegisterUserData) => {
    try {
      const subData = {
        ...data,
        dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob
      }
      console.log(subData)
      await authSvc.registerUser(subData)
      // console.log(response)
      navigate('/auth')
      toast.success("you sucessfully register with us")
      // navigate('/')
      // eslint-disable-next-line
    } catch (exception: any) {
      toast.error("cannot register at the moment")
      if (exception.code === 400) {
        Object.keys(exception.error.error).forEach((field) => {
          setError(field as keyof IRegisterUserData, { message: exception.error.error[field] });
        })
      }
    }
  };

  return (
    <>
      <PageTitle title={"Create Account"} className="text-pink-900/60 text-center text-4xl" />
      <hr className="border-t-2 border-t-teal-800/5 mt-4" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto px-4 pb-6 
                 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent
                 animate-fade-in"
      >
        <div className="flex flex-col gap-5 mt-4">
          <TextInputContent
            name="name"
            control={control}
            label="Full Name"
            errorMessage={errors?.name?.message}
          />
          <EmailInputContent
            name="email"
            control={control}
            label="Email"
            errorMessage={errors?.email?.message}
          />
        </div>

        <div className="flex flex-col gap-5">
          <PasswordInputContent
            name="password"
            control={control}
            label="Password"
            errorMessage={errors?.password?.message}
          />
          <PasswordInputContent
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            errorMessage={errors?.confirmPassword?.message}
          />
        </div>
        <div className="flex flex-col gap-5">
          <NumberInputContent
            name="age"
            control={control}
            label="Age"
            errorMessage={errors?.age?.message}
          />
        </div>

        <div className="flex flex-col gap-5">
          <SelectInputContent
            name="role"
            control={control}
            label="Register As"
            options={[
              { label: "student", value: "student" },
              { label: "employer", value: "employer" }
            ]}
            errorMessage={errors?.role?.message}
          />
          <DateInputContent
            name="dob"
            control={control}
            label="Date of Birth"
            errorMessage={errors?.dob?.message}
          />
        </div>

        <div className="flex flex-col gap-5">
          <RadioInputContent
            name="gender"
            control={control}
            label="Gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Others", value: "other" }
            ]}
            errorMessage={errors?.gender?.message}
          />
          <FileInputContent
            name="image"
            control={control}
            label="Profile Image"
            //enlist-next-line-disabled
            errorMessage={errors?.image?.message as any}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
      flex-1 py-3 font-semibold text-white rounded-xl
      bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500
      hover:from-pink-500 hover:via-red-500 hover:to-orange-400
      hover:shadow-2xl transform hover:scale-[1.05]
      transition-all duration-500 ease-in-out shadow-md

      disabled:bg-yellow-800 disabled:bg-none disabled:text-gray-300 disabled:cursor-not-allowed
      disabled:hover:from-yellow-800 disabled:hover:to-yellow-800
    "
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => reset()}
            disabled={isSubmitting}
            className="
      flex-1 py-3 font-semibold text-gray-800 rounded-xl border border-gray-300
      bg-gradient-to-r from-gray-100 to-gray-50
      hover:from-green-400 hover:to-emerald-500 hover:text-white
      hover:shadow-2xl transform hover:scale-[1.05]
      transition-all duration-500 ease-in-out

      disabled:bg-teal-800/70 disabled:text-gray-200 disabled:cursor-not-allowed
      disabled:bg-none disabled:hover:from-teal-800 disabled:hover:to-teal-800
    "
          >
            Reset
          </button>
        </div>
        <DividerHalf />
        <div className="italic text-center text-sm text-gray-600 ">
          <span>Already have an account?{" "}</span>
          <NavLink
            to="/auth"
            className="text-blue-600 font-medium hover:text-indigo-700 hover:underline transition-all duration-300"
          >
            Login
          </NavLink>
        </div>
      </form>
    </>
  );
}


export default Register;
