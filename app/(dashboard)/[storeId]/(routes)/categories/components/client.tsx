"use client";

import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import React from "react";
import {CategoryColumn,columns} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/columns";
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";

interface CategoryClientProps{
    data:CategoryColumn[]
}



export const CategoryClient:React.FC<CategoryClientProps> = ({data}) =>{

    const router = useRouter();

    const params = useParams();


    return(
        <>
        <div className="flex items-center justify-between">
            <Heading title={`Categories (${data.length})`} description="Manage categories"/>
            <Button onClick={()=>router.push(`/${params.storeId}/categories/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Add new
            </Button>
        </div>
        <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API" description="API CALLS FOR CATEGORIES"/>
            <Separator/>
            <ApiList entityName="categories" entityId="categoryId"/>
        </>
    )
}