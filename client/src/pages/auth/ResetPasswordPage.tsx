import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PasswordInputContent } from "../../component/input/inputComponent";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router";
import authSvc from "../../services/auth.service";
import PageTitle from "../../component/PageTitle";
import { NavLink } from "react-router";
import { DividerHalf } from "../../component/DividerHalf";

const ResetPasswordSchema = yup.object({
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),
});

interface IResetPassword {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<IResetPassword>({
      resolver: yupResolver(ResetPasswordSchema),
      defaultValues: { password: "", confirmPassword: "" },
    });

  const onSubmit = async (data: IResetPassword) => {
    try {
      await authSvc.resetPassword(token!, { password: data.password });
      toast.success("Password reset successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to reset password", {
        description: error?.response?.data?.message || "Try again later.",
      });
    }
  };

  return (
    <>
      <PageTitle
        title={"Create New Password"}
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
          <PasswordInputContent
            name="password"
            control={control}
            label="New Password"
            errorMessage={errors?.password?.message}
          />
          <PasswordInputContent
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            errorMessage={errors?.confirmPassword?.message}
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
            Update Password
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
          Go back to{" "}
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

export default ResetPasswordPage;
