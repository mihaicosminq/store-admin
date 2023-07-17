"use client";

import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import React from "react";
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";
import {ProductColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";

interface ProductClientProps {
   data: ProductColumn[]
}


export const ProductClient: React.FC<ProductClientProps> = ({data}) => {

   const router = useRouter();

   const params = useParams();


   return (
      <>
         <div className="flex items-center justify-between">
            <Heading title={`Products (${data.length})`} description="Manage products"/>
            <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
               <Plus className="mr-2 h-4 w-4"/>
               Add new
            </Button>
         </div>
         <Separator/>
         <DataTable searchKey="name" columns={columns} data={data}/>
         <Heading title="API" description="API CALLS FOR PRODUCTS"/>
         <Separator/>
         <ApiList entityName="products" entityId="productId"/>
      </>
   )
}