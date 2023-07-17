import prismadb from "@/lib/prismadb";
import { ProductClient} from "@/app/(dashboard)/[storeId]/(routes)/products/components/client";
import {format} from "date-fns"
import {formatter} from "@/lib/utils";
import {ProductColumn} from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";

const ProductsPage = async ({params}: { params: { storeId: string } }) => {

   const product = await prismadb.product.findMany({
      where: {storeId: params.storeId},
      orderBy: {createdAt: "desc"},
      include: {category: true, color: true, element: true}
   })


   const formatProduct: ProductColumn[] = product.map((bb) => ({
      id: bb.id,
      name: bb.name,
      isFeatured: bb.isFeatured,
      isArchived: bb.isArchived,
      price:formatter.format(bb.price.toNumber()),
      category:bb.category.name,
      element:bb.element.name,
      color:bb.color.value,
      createdAt: format(bb.createdAt, "MMMM do," +
         " yyyy")
   }))

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductClient data={formatProduct}/>
         </div>
      </div>
   )
}
export default ProductsPage;