import { useNavigate, useParams } from "react-router";
import authSvc from "../../services/auth.service";
import { toast } from "sonner";
import { useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ErrorMessage, SucessMessage } from "../../component/input/notification";

const ActivationProgressPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const activateUser = useCallback(async () => {
    try {
      await authSvc.activateUserAccount(token as string);
      toast.success(SucessMessage.ActivationSucess);
    } catch {
      toast.error(ErrorMessage.ActivationError);
    } finally {
      setTimeout(() => navigate("/auth"), 2000);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) activateUser();
  }, [activateUser, token]);

  return (
    <div className="h-96 flex flex-col justify-center items-center">
      <Loader2 className="animate-spin w-20 h-20 text-blue-500" />
      <p className="mt-4 text-gray-600 text-lg">Activating your account...</p>
    </div>
  );
};

export default ActivationProgressPage;
