export interface IDividerHalf{
    value?: string
}

export const DividerHalf = ({value= ""}: Readonly<IDividerHalf>) =>{
    return (
        <>
        <span className="flex items-center">
            <span className="h-px flex-1 bg-gray-300"></span>
            {
             value ?   <span className="shrink-0 px-4 text-gray-900">{value}</span>: <></>
            }
            <span className="h-px flex-1 bg-gray-300"></span>
        </span>
        </>
    )
}