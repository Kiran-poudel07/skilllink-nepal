import axios from "axios";

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_PRODUCTION_BASE_URL || import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    timeoutErrorMessage: "Server timed out...",
    responseType: "json",
    headers: {
        "Content-Type": "application/json"
    }
})

export interface AxiosSucessResponse {
    // eslint-disable-next-line
    data:any,
    length: number,
    message:string,
    options:{
        pagination:{
            limit:number,
            page:number,
            total:number,
        status:string
        }
    }
}

axiosConfig.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("_at_44") || null;
        if(token){
            console.log(token)
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }
)

axiosConfig.interceptors.response.use(
    (response)=>{
        return response.data
    },
    (exception) => {
        throw{
            error: exception?.response?.data || null,
            code: exception.status
        }
    }
)

export default axiosConfig