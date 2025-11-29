import axiosConfig from "../config/axios.config";
import type { ICredentials, IRegisterUserData } from "../pages/auth/auth.contract";

class AuthService {
    async registerUser(data: IRegisterUserData) {
        return await axiosConfig.post("auth/register", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }
    async activateUserAccount(token:string) {
        return await axiosConfig.get("auth/activate/"+token)
    }

    async loginUser(user: ICredentials) {
        const response = await axiosConfig.post("auth/login", user)
        localStorage.setItem("_at_44", response.data.tokens.accessToken);
        localStorage.setItem("_rt_44", response.data.tokens.refreshToken);
    }

    async getloggedInUser(){
        const response = await axiosConfig.get("users/me")
        return response.data
    }
    async forgotPassword(data: { email: string }) {
    return await axiosConfig.post("auth/forgot-password/", data);
  }

  async resetPassword(token: string, data: { password: string }) {
    return await axiosConfig.post(`auth/reset-password/${token}`, data);
  }
}

const authSvc = new AuthService()
export default authSvc