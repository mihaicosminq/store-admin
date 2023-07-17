import React from "react";

export  default function AuthLayout ({children}:{children:React.ReactNode}){
    return (
        <div className="bg-purple-950 flex items-center justify-center h-full">{children}</div>
    )
}