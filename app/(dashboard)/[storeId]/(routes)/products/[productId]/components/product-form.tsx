"use client"
import * as z from "zod";
import React, {useState} from "react";
import {Heading} from "@/components/ui/Heading"
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@radix-ui/react-separator";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input"
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import {AlertModal} from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import {Category, Image, Product, Color, Element} from "@prisma/client";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

interface ProductFormProps {
   initialData: Product & {
      images: Image[]
   } | null,
   categories: Category[],
   element: Element[],
   colors: Color[],
}

const formSchema = z.object({
   name: z.string().min(1),
   images: z.object({url: z.string()}).array(),
   price: z.coerce.number().min(1),
   categoryId: z.string().min(1),
   colorId: z.string().min(1),
   elementId: z.string().min(1),
   isFeatured: z.boolean().default(false).optional(),
   isArchived: z.boolean().default(false).optional()
});

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps> = ({initialData, categories, colors, element}) => {

   const params = useParams();
   const router = useRouter();

   const title = initialData ? "Edit product" : "Create product";
   const description = initialData ? "Edit product" : "add product";
   const toastMessage = initialData ? "product updated" : "product created";
   const action = initialData ? "save changes" : "create";

   const form = useForm<ProductFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData ? {...initialData, price: parseFloat(String(initialData?.price))} : {
         name: "",
         images: [],
         price: 0,
         categoryId: "",
         colorId: "",
         elementId: "",
         isFeatured: false,
         isArchived: false
      }
   })

   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);


   const onSubmit = async (data: ProductFormValues) => {
      try {
         setLoading(true)
         if (initialData) {
            await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
         } else {
            await axios.post(`/api/${params.storeId}/products`, data);
         }
         router.refresh()
         router.push(`/${params.storeId}/products`)
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
         await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
         router.refresh()
         router.push(`${params.storeId}/products`)
         toast.success("Product deleted")
      } catch (error) {
         toast.error("something went wrong")
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
               name="images"
               render={({field}) => (
                  <FormItem>
                     <FormLabel>Images</FormLabel>
                     <FormControl>
                        <ImageUpload disabled={loading}
                                     onChange={(url) => field.onChange([...field.value, {url}])}
                                     onRemove={(url) => field.onChange([...field.value.filter((currentValue) => currentValue.url !== url)])}
                                     value={field.value.map((value) => (value.url))}/>
                     </FormControl>
                     <FormMessage/>
                  </FormItem>
               )}
            />
            <div className="grid grid-cols-3 gap-8">
               <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                     <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                           <Input disabled={loading} placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage/>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="price"
                  render={({field}) => (
                     <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                           <Input disabled={loading} placeholder="9,99" {...field} type="number"/>
                        </FormControl>
                        <FormMessage/>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="categoryId"
                  render={({field}) => (
                     <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value}
                                defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue defaultValue={field.value} placeholder="select a category">

                                 </SelectValue>
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {categories.map((category) => (
                                 <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage/>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="elementId"
                  render={({field}) => (
                     <FormItem>
                        <FormLabel>Element</FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value}
                                defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue defaultValue={field.value} placeholder="select an element">

                                 </SelectValue>
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {element.map((category) => (
                                 <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage/>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="colorId"
                  render={({field}) => (
                     <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value}
                                defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue defaultValue={field.value} placeholder="select a Color">

                                 </SelectValue>
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {colors.map((category) => (
                                 <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage/>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({field}) => (
                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                           <Checkbox checked={field.value}
                              // @ts-ignore
                                     onCheckedChange={field.onChange}
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>
                              Featured
                           </FormLabel>
                           <FormDescription>
                              This product will appear on the homepage
                           </FormDescription>
                        </div>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="isArchived"
                  render={({field}) => (
                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                           <Checkbox checked={field.value}
                              // @ts-ignore
                                     onCheckedChange={field.onChange}
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>
                              Archived
                           </FormLabel>
                           <FormDescription>
                              This product will not appear in the store
                           </FormDescription>
                        </div>
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