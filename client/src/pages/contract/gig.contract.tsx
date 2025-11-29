import * as Yup from 'yup';

export interface IGigValues {
    title: string;
    description: string;
    category: string; 
    budget: number;
    duration: string;
    requiredSkills: string[]; 
    files: any[]| null;
}

export interface IGigWithStatus extends IGigValues {
  _id?:string|null ;
  status: string;
  applicationsCount: number;
  isDeleted: boolean;
}




export const GigDefaultValues: IGigValues = {
    title: "",
    description: "",
    category: "", 
    budget: 0,    
    duration: "",
    requiredSkills: [],  
    files: [],
};
export const GigWithStatusDefaultValues: IGigWithStatus = {
  ...GigDefaultValues,
  _id:'',
  status: "inactive",
  applicationsCount: 0,
  isDeleted: false,
};


export const gigDTO = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"), 
    budget: Yup.number().required("Budget is required").positive("Budget must be positive"),
    duration: Yup.string().required("Duration is required"),
    requiredSkills: Yup.array(Yup.string().required()).min(1, "At least one skill is required"), 
    files:Yup.array(Yup.mixed())
});