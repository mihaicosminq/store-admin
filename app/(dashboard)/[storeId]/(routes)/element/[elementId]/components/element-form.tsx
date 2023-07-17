"use client"
import * as z from "zod";
import {Element} from ".prisma/client";
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

interface ElementFormProps {
    initialData: Element | null,

}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
})

type ElementFormValue = z.infer<typeof formSchema>

export const ElementForm: React.FC<ElementFormProps> = ({initialData}) => {

    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit element" : "Create element";
    const description = initialData ? "Edit element" : "add element";
    const toastMessage = initialData ? "element updated" : "element created";
    const action = initialData ? "save changes" : "create";

    const form = useForm<ElementFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {name: "", value: "",}
    })

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data: ElementFormValue) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/element/${params.elementId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/element`, data);
            }
            router.refresh()
            router.push(`/${params.storeId}/element`)
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
            await axios.delete(`/api/${params.storeId}/element/${params.elementId}`)
            router.refresh()
            router.push(`${params.storeId}/element`)
            toast.success("element deleted")
        } catch (error) {
            toast.error("make sure you removed all element")
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
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Element Name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="value"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Element value" {...field} />
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