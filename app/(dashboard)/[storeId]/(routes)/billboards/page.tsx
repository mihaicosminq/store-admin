import {BillboardClient} from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/client";
import prismadb from "@/lib/prismadb";
import {format} from "date-fns"
import {BillboardColumn} from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns";

const BillboardsPage = async ({params}: { params: { storeId: string } }) => {

   const billboard = await prismadb.billboard.findMany({
      where: {storeId: params.storeId},
      orderBy: {createdAt: "desc"}
   })

   const formatBillboard: BillboardColumn[] = billboard.map((bb) => ({
      id: bb.id, label: bb.label, createdAt: format(bb.createdAt, "MMMM do, yyyy")
   }))

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardClient data={formatBillboard}/>
         </div>
      </div>
   )
}
export default BillboardsPage;