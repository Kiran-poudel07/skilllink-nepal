import * as Yup from "yup";
import { Gender, UserRoles, type UserRole } from "../../config/constant";

export interface ICredentials{
    email:string,
    password:string
}

export const loginDTO = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required()
})

export interface IRegisterUserData {
    //enlist-disable-next-line
    image: any;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    gender: Gender | null
    dob: Date | string | null | undefined;
    age:number | null
}

export const registerDefaultValues: IRegisterUserData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: UserRoles.STUDENT,
    gender: null,
    dob: null,
    image: undefined,
    age:null
};

export const RegisterDTO = Yup.object({
    name: Yup.string().min(2).max(50).required(),
    email: Yup.string().email().required(),
    role: Yup.string()
        .matches(/^(employer|student)$/)
        .default(UserRoles.STUDENT),
    password: Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\w_]).{8,25}$/)
        .required(),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref("password")],
        "Password and confirm Password must match"
    ),
    age: Yup.number()
    .min(10, "Age must be at least 10")
    .max(50, "Age must be less than 100")
    .required("Age is required"),

    gender: Yup.string().matches(/^male|female|other$/).nullable(),
    dob: Yup.date().nullable(),
    image: Yup.mixed()
})
