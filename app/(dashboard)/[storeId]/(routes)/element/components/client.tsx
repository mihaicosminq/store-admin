"use client";

import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import React from "react";
import {ElementColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/element/components/columns"
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";

interface ElementClientProps {
    data: ElementColumn[]
}


export const ElementClient: React.FC<ElementClientProps> = ({data}) => {

    const router = useRouter();

    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Element (${data.length})`} description="Manage elements"/>
                <Button onClick={() => router.push(`/${params.storeId}/element/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add new
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="value" columns={columns} data={data}/>
            <Heading title="API" description="API CALLS FOR ELEMENT"/>
            <Separator/>
            <ApiList entityName="element" entityId="elementId"/>
        </>
    )
}