import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function PATCH(req: Request, {params}: {
    params: {
        storeId: string,
        elementId: string
    }
}) {
    try {
        if (!params.elementId) {
            return new NextResponse("elementId required", {status: 400})
        }
        const {userId} = auth();
        const body = await req.json();
        const {name, value} = body;

        if (!name) {
            return new NextResponse("name required required", {status: 400})
        }


        if (!value) {
            return new NextResponse("value required", {status: 400})
        }

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})

        }

        const storeByUserId = await prismadb.store.findFirst(
            {
                where:
                    {
                        id: params.storeId, userId
                    }
            })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const element = await prismadb.element.updateMany({
            where: {
                id: params.elementId,
            }, data: {name, value}
        })

        return NextResponse.json(element)


    } catch (error) {
        console.log(['BILLBOARD_PATCH'], error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function DELETE(req: Request, {params}: {
    params: { storeId: string, elementId: string }
}) {
    try {
        const {userId} = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})

        }

        if (!params.elementId) {
            return new NextResponse("billboard is required", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse("Store id required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({where: {id: params.storeId, userId}})

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }


        const element = await prismadb.element.deleteMany({
            where: {
                id: params.elementId,
            }
        })

        return NextResponse.json(element)


    } catch (error) {
        console.log(['element_DELETE'], error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function GET(req: Request, {params}: {
    params: { elementId: string }
}) {
    try {

        if (!params.elementId) {
            return new NextResponse("element is required", {status: 400})
        }

        const element = await prismadb.element.findUnique(
            {
                where:
                    {id: params.elementId}
            })



        return NextResponse.json(element)


    } catch (error) {
        console.log(['element_GET'], error)
        return new NextResponse("Internal error", {status: 500})
    }
}