import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, {params}: { params: { storeId: string } }) {
    try {

        const {userId} = auth();
        const body = await req.json();
        const {name, value} = body;

        if (!name) {
            return new NextResponse("name is required", {status: 400})
        }
        if (!value) {
            return new NextResponse("value is required", {status: 400})
        }

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if (!params.storeId) {
            return new NextResponse("storeId required", {status: 401})

        }

        const storeByUserId = await prismadb.store.findFirst({where: {id: params.storeId, userId}})

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const element = await prismadb.element.create({
            data: {name, value, storeId: params.storeId}
        });

        return NextResponse.json(element)

    } catch (error) {

        console.log(["element_POST"], error)

        return new NextResponse("Internal error ", {status: 500});
    }
}

export async function GET(req: Request, {params}: { params: { storeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("storeId required", {status: 401})

        }

        const element = await prismadb.element.findMany({
            where: {storeId: params.storeId}
        });

        return NextResponse.json(element)

    } catch (error) {

        console.log(["element_GET"], error)

        return new NextResponse("Internal error ", {status: 500});
    }
}