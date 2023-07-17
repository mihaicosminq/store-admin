"use client"
import * as z from "zod";
import {Billboard} from ".prisma/client";
import React, {useState} from "react";
import {Heading} from "@/components/ui/Heading"
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@radix-ui/react-separator";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input"
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import {AlertModal} from "@/components/modals/alert-modal";
import {ApiAlert} from "@/components/ui/api-alert";
import {useOrigin} from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps {
    initialData: Billboard | null,

}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type BillboardFormValue = z.infer<typeof formSchema>

export const BillboardForm: React.FC<BillboardFormProps> = ({initialData}) => {

    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit billboard" : "Create billboard";
    const description = initialData ? "Edit billboard" : "add billboard";
    const toastMessage = initialData ? "billboard updated" : "billboard created";
    const action = initialData ? "save changes" : "create";

    const form = useForm<BillboardFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {label: "", imageUrl: ""}
    })

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data: BillboardFormValue) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            }else{
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMessage)

        } catch (error) {
            toast.error("something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`${params.storeId}/billboards`)
            toast.success("Billboard deleted")
        } catch (error) {
            toast.error("make sure you removed all categories")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }


    return (<>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>
        <div className="flex items-center justify-between">
            <Heading title={title} description={description}/>
            {initialData && <Button
                disabled={loading}
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
            >
                <Trash className="h-4 w-4"/>
            </Button>}
        </div>
        <Separator/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>background</FormLabel>
                            <FormControl>
                                <ImageUpload disabled={loading} onChange={(url) => field.onChange(url)}
                                             onRemove={() => field.onChange("")}
                                             value={field.value ? [field.value] : []}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="label"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Billboard label" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    {action}
                </Button>
            </form>
        </Form>
    </>)
}