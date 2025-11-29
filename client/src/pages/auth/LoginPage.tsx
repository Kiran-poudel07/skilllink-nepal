import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import authSvc from "../../services/auth.service";
import PageTitle from "../../component/PageTitle";
import { NavLink, useNavigate } from "react-router";
import { DividerHalf } from "../../component/DividerHalf";
import { loginDTO, type ICredentials } from "./auth.contract";
import { EmailInputContent, PasswordInputContent } from "../../component/input/inputComponent";
import { ErrorMessage, SucessMessage } from "../../component/input/notification";
import { useAuth } from "../../context/auth.context";


const LoginPage = () => {

  const { control, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm({
    defaultValues: {
      email: "",
      password: ""
    } as ICredentials,
    resolver: yupResolver(loginDTO)
  })

  const navigate = useNavigate()
  const { setLoggedInUser } = useAuth()

  const onSubmit = async (data: ICredentials) => {
    try {
      await authSvc.loginUser(data)
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const LoggedInUserProfile = await authSvc.getloggedInUser()

      setLoggedInUser(LoggedInUserProfile)

      toast.success("Login successfully", {
        description: SucessMessage.LoginSucess
      })
      navigate('/' + LoggedInUserProfile.role + "/dashboard")
      // eslint-disable-next-line
    } catch (exception: any) {
      toast.error("Sorry! Cannot login!!!", {
        description: ErrorMessage.LoginError
      })
      if (exception.code === 400) {
        Object.keys(exception.error.error).map((key) => {
          setError(key as keyof ICredentials, { message: exception.error.error[key] })
        })
      }
    }
  }

  return (
    <>
      <PageTitle title={`Sign In`} className="text-indigo-600 text-center text-4xl" />
      <hr className="border-t-2 border-t-teal-800/5 mt-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto px-4 pb-6 
                 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent
                 animate-fade-in"
      >
        <div className="flex flex-col gap-5 mt-3">
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
        </div>
        <div className="italic text-sm flex justify-end">
          <NavLink
            to="/auth/forget-password"
            className="text-blue-600 font-medium hover:text-indigo-700 hover:underline transition-all duration-300"
          >
            forgetpassword?
          </NavLink>
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
            Login
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
        <p className="italic text-center text-sm text-gray-600 ">
          <span>Don't have any account?{" "}</span>
          <NavLink
            to="/auth/register"
            className="text-blue-600 font-medium hover:text-indigo-700 hover:underline transition-all duration-300"
          >
            Register
          </NavLink>
        </p>
      </form>

    </>
  );
}


export default LoginPage;
