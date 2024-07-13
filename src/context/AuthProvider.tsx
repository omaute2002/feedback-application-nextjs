'use client'


// this is might be similar to the useContext but 
// this is custom contextProvider which will provide the 
// section information thorughtout the applicatioj 
import{SessionProvider} from "next-auth/react"
export default function AuthProvider({
    children,
}:{children:React.ReactNode}){
    return(
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}


