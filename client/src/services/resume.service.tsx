import axiosConfig from "../config/axios.config";
import type { IResumeEmployer, IResumeStudent } from "../pages/contract/resume.contract";

class ResumeService {

submitStudentResume = async (Sdata: IResumeStudent) => {

    return await axiosConfig.put("upload/me", Sdata, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

};
submitEmployerResume = async (Edata:IResumeEmployer) => {

    return await axiosConfig.put("upload/me", Edata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

};
}

const resumeSvc = new ResumeService()
export default resumeSvc