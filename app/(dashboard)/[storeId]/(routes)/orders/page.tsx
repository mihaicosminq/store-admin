import { OrdersClient} from "@/app/(dashboard)/[storeId]/(routes)/orders/components/client";
import prismadb from "@/lib/prismadb";
import {format} from "date-fns"
import {formatter} from "@/lib/utils";
import {OrderColumn,columns} from "@/app/(dashboard)/[storeId]/(routes)/orders/components/columns";

const OrdersPage = async ({params}: { params: { storeId: string } }) => {

   const orders = await prismadb.order.findMany({
      where: {storeId: params.storeId}, include: {
         orderItems: {
            include: {product: true}
         }
      }, orderBy: {createdAt: "desc"}
   })

   const formatOrder: OrderColumn[] = orders.map((bb) => ({
      id: bb.id,
      phone:bb.phone,
      address:bb.address,
      products:bb.orderItems.map((order)=>(order.product.name)).join(","),
      totalPrice:formatter.format(bb.orderItems.reduce((total,item)=>{return total + Number(item.product.price)},0)),
      isPaid:bb.isPaid,
      createdAt: format(bb.createdAt, "MMMM do, yyyy")
   }))

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <OrdersClient data={formatOrder}/>
         </div>
      </div>
   )
}
export default OrdersPage;