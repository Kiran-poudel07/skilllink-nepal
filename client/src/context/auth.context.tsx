import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react"
import type { Gender, ImageType, Status, UserRole } from "../config/constant"
import authSvc from "../services/auth.service";
import { Spin } from "antd";
export interface ILoggedInUserProfile{
    dob:Date,
    email:string,
    gender:Gender,
    image:ImageType,
    name:string,
    role:UserRole,
    status:Status,
    _id:string

}
export interface IAuthContext{
    loggedInUser: null | ILoggedInUserProfile;
    setLoggedInUser: Dispatch<SetStateAction<ILoggedInUserProfile | null>>
}

export interface IauthProviderProps {
    children: React.ReactNode
}

export const AuthContext = createContext<IAuthContext>({
    loggedInUser: null,
    setLoggedInUser: () =>{}
});

export const useAuth = () => {
    const{ loggedInUser, setLoggedInUser} = useContext(AuthContext);

    return {
        loggedInUser,
        setLoggedInUser
    }
}

export const AuthProvider = ({children}: IauthProviderProps) => {
    const [loggedInUser,setLoggedInUser] = useState<ILoggedInUserProfile | null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    const getloggedInUserProfile = async() =>{
        try{
            const response = await authSvc.getloggedInUser()
            setLoggedInUser(response)
        }catch{
            // 
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("_at_44") || null;
        if(token) {
            getloggedInUserProfile();
        }else{
            setLoading(false)
        }
    }, [])

    return (
        loading ? <Spin fullscreen /> : <><AuthContext.Provider
        value = {{
            loggedInUser:loggedInUser,
            setLoggedInUser:setLoggedInUser
        }}
        >
            {children}
        </AuthContext.Provider>
        </>
    )
}
