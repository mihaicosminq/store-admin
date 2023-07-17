import prismadb from "@/lib/prismadb";
import {format} from "date-fns"
import { ElementColumn } from "@/app/(dashboard)/[storeId]/(routes)/element/components/columns"
import {ElementClient} from "@/app/(dashboard)/[storeId]/(routes)/element/components/client";



const ElementPage = async ({params}: { params: { storeId: string } }) => {

   const element = await prismadb.element.findMany({
      where: {storeId: params.storeId},
      orderBy: {createdAt: "desc"}
   })


   const formatElement: ElementColumn[] = element.map((bb) => ({
      id: bb.id, name: bb.name,value:bb.value, createdAt: format(bb.createdAt, "MMMM do, yyyy")
   }))

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <ElementClient data={formatElement}/>
         </div>
      </div>
   )
}
export default ElementPage;