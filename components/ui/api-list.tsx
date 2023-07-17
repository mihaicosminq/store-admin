"use client"

import React from "react";
import {useOrigin} from "@/hooks/use-origin";
import {useParams} from "next/navigation";
import {ApiAlert} from "@/components/ui/api-alert";

interface ApiListProps {
   entityName: string,
   entityId: string
}

export const ApiList: React.FC<ApiListProps> = ({entityName, entityId}) => {
   const origin = useOrigin();
   const params = useParams();
   const baseUrl = `${origin}/api/${params.storeId}`


   return (
      <>
         <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`}/>
         <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}/{${entityId}}`}/>
         <ApiAlert title="POST" variant="admin" description={`${baseUrl}/${entityName}`}/>
         <ApiAlert title="PATCH" variant="admin" description={`${baseUrl}/${entityName}/{${entityId}}`}/>
         <ApiAlert title="DELETE" variant="public" description={`${baseUrl}/${entityName}/{${entityId}}`}/>
      </>
   )
}