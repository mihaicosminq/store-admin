"use client";
import * as z from "zod";
import {Modal} from "@/components/ui/Modal";
import {
   useStoreModal
} from "@/hooks/use-store-modal";
import {useForm} from "react-hook-form";
import {
   zodResolver
} from "@hookform/resolvers/zod";
import {
   Form, FormControl,
   FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({name: z.string().min(1)})

export const StoreModal = () => {

   const storemodal = useStoreModal();
   const [isLoading,setIsLoading] = useState(false);


   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {name: ""}
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try{
         setIsLoading(true);
         const res = await axios.post("/api/stores",values);
         window.location.assign(`/${res.data.id}`)
      }catch (err){
         toast.error("something went wrong");
      }finally {
         setIsLoading(false)
      }
   }

   return (
      <Modal title={"test"} description={"test"}
             isOpen={storemodal.isOpen}
             onClose={storemodal.onClose}>
         <div>
            <div
               className="space-y-4 py-2 pb-4">
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}>
                     <FormField
                        render={({field}) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="write a store name" {...field} />
                              </FormControl>
                              <FormMessage/>
                           </FormItem>)}
                        control={form.control}
                        name="name"/>
                     <div
                        className="pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button variant="outline"
                                disabled={isLoading}
                                onClick={storemodal.onClose}>Cancel</Button>
                        <Button disabled={isLoading} type="submit">Continue</Button>
                     </div>
                  </form>
               </Form>
            </div>
         </div>
      </Modal>
   )

}