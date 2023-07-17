import prismadb from "@/lib/prismadb";
import {format} from "date-fns"
import {ColorColumn} from "@/app/(dashboard)/[storeId]/(routes)/colors/components/columns";
import {ColorClient} from "@/app/(dashboard)/[storeId]/(routes)/colors/components/client";


const ColorsPage = async ({params}: { params: { storeId: string } }) => {

   const color = await prismadb.color.findMany({
      where: {storeId: params.storeId},
      orderBy: {createdAt: "desc"}
   })


   const formatColor: ColorColumn[] = color.map((bb) => ({
      id: bb.id, name: bb.name,value:bb.value, createdAt: format(bb.createdAt, "MMMM do, yyyy")
   }))

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <ColorClient data={formatColor}/>
         </div>
      </div>
   )
}
export default ColorsPage;