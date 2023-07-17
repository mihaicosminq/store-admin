import prismadb from "@/lib/prismadb";
import {ElementForm} from "@/app/(dashboard)/[storeId]/(routes)/element/[elementId]/components/element-form";


const ElementPage = async ({params}: { params: { elementId: string } }) => {

    const element = await prismadb.element.findUnique({where: {id: params.elementId}})



    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <ElementForm initialData={element}/>
            </div>
        </div>
    )
}
export default ElementPage;