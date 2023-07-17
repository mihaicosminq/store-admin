import React, {useState} from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuTrigger,
   DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Copy, Edit, MoreHorizontal, Trash} from "lucide-react";
import toast from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {AlertModal} from "@/components/modals/alert-modal";
import {ColorColumn,columns} from "@/app/(dashboard)/[storeId]/(routes)/colors/components/columns";


interface CellActionProps {
   data: ColorColumn
}


export const CellAction: React.FC<CellActionProps> = ({data}) => {

   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const params = useParams();
   const onCopy = (id: string) => {
      navigator.clipboard.writeText(id);
      toast.success("Color route copied")
   }

   const onDelete = async () => {
      try {
         setLoading(true)
         await axios.delete(`/api/${params.storeId}/colors/${data.id}`)
         router.refresh()
         toast.success("Element deleted")
      } catch (error) {
         toast.error("make sure you removed all colors")
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }

   return (
      <>
         <AlertModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} loading={loading} />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
               <span className="sr-only">Open</span>
               <MoreHorizontal className="h-4 w-4"/>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuLabel>
               Actions
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}>
               <Edit className="mr-2 h-4 w-4"/>
               Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCopy(data.id)}>
               <Copy className="mr-2 h-4 w-4"/>
               Copy id
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>setOpen(true)}>
               <Trash className="mr-2 h-4 w-4"/>
               Delete
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   </>
   )
}