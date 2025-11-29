import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EmailInputContent } from "../../component/input/inputComponent";
import { toast } from "sonner";
import authSvc from "../../services/auth.service";
import PageTitle from "../../component/PageTitle";
import { NavLink } from "react-router";
import { DividerHalf } from "../../component/DividerHalf";

const ForgetPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

interface IForgetPassword {
  email: string;
}

const ForgetPasswordPage = () => {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<IForgetPassword>({
      resolver: yupResolver(ForgetPasswordSchema),
      defaultValues: { email: "" },
    });

  const onSubmit = async (data: IForgetPassword) => {
    try {
      await authSvc.forgotPassword(data);
      toast.success("Password reset link sent!", {
        description: "Check your email inbox for the reset link.",
      });
      reset();
    } catch (error: any) {
      toast.error("Failed to send reset link", {
        description: error?.response?.data?.message || "Try again later.",
      });
    }
  };

  return (
    <>
      <PageTitle
        title={"Forgot Password"}
        className="text-red-600/50 text-center text-4xl"
      />
      <hr className="border-t-3 border-stone-800/5 mt-4" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto px-4 pb-6 
                 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent
                 animate-fade-in"
      >
        <div className="flex flex-col gap-5 mt-4">
          <EmailInputContent
            name="email"
            control={control}
            label="Email"
            errorMessage={errors?.email?.message}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-5 ">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex-1 py-3 font-semibold text-white rounded-xl
              bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500
              hover:from-pink-500 hover:via-red-500 hover:to-orange-400
              hover:shadow-2xl transform hover:scale-[1.05]
              transition-all duration-500 ease-in-out shadow-md
              disabled:bg-yellow-800 disabled:text-gray-300 disabled:cursor-not-allowed
            "
          >
            Send Link
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
            "
          >
            Reset
          </button>
        </div>

        <DividerHalf />

        <p className="italic text-center text-sm text-gray-600 ">
          Remembered your password?{" "}
          <NavLink
            to="/auth"
            className="text-blue-600 font-medium hover:text-indigo-700 hover:underline transition-all duration-300"
          >
            Login
          </NavLink>
        </p>
      </form>
    </>
  );
};

export default ForgetPasswordPage;
