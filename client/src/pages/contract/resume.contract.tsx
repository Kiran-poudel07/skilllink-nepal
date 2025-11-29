import * as Yup from "yup";

export interface IResumeStudent {
  role: string
  bio: string;
  education: string;
  experience: string;
  skills: string[];
  portfolioLinks: string[];
  avatar: any;
  resume: any;
}
export interface IResumeEmployer {
  role:string,
  companyName:string,
  companyDescription:string,
  companyAddress:string,
  contactInfo:number | null,
  companyLogo:any,
  companyDocs:any
  category:string,
}

export const EmployerResumeDefaultValues: IResumeEmployer = {
  role:"employer",
  companyName:"",
  companyDescription:"",
  companyAddress:"",
  contactInfo:null,
  companyLogo:undefined,
  companyDocs:undefined,
  category:"",
}

export const StudentResumeDefaultValues: IResumeStudent = {
  role: "student",
  bio: "",
  education: "",
  experience: "",
  skills: [""],           
  portfolioLinks: [""],   
  avatar: undefined,
  resume: undefined,
};


export const ResumeStudentDTO = Yup.object({
  role: Yup.string().required("Role is required").default("student"),
  bio: Yup.string().required("Bio is required"),
  education: Yup.string().required("Education is required"),
  experience: Yup.string().required("Experience is required"),
  skills: Yup.array().of(Yup.string().required("Skill is required")).min(1, "At least one skill is required"),
  portfolioLinks: Yup.array().of(Yup.string().url("Invalid URL").required("Portfolio URL is required")).min(1, "At least one portfolio link is required"),
  avatar: Yup.mixed().required("Avatar is required"),
  resume: Yup.mixed().required("Resume is required"),
});
export const ResumeEmployerDTO = Yup.object({
  role: Yup.string().required("Role is required").default("employer"),
  companyName: Yup.string().required("company name is required"),
  companyDescription: Yup.string().required("Company description  is required"),
  companyAddress: Yup.string().required("company address is required"),
  category: Yup.string().required("category address is required"),
  contactInfo:Yup.number().required("company number is required"),
  companyLogo: Yup.mixed().required("company logo  is required"),
  companyDocs: Yup.mixed().required("company docs is required"),
});