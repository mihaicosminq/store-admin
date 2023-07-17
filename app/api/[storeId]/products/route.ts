import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, {params}: { params: { storeId: string } }) {
   try {

      const {userId} = auth();
      const body = await req.json();
      const {name, price, categoryId, colorId, elementId, images, isFeatured, isArchived} = body;

      if (!name) {
         return new NextResponse("name is required", {status: 400})
      }
      if (!price) {
         return new NextResponse("price is required", {status: 400})
      }
      if (!categoryId) {
         return new NextResponse("categoryId is required", {status: 400})
      }
      if (!colorId) {
         return new NextResponse("colorId is required", {status: 400})
      }
      if (!elementId) {
         return new NextResponse("elementId is required", {status: 400})
      }
      if (!images || !images.length) {
         return new NextResponse("images are required", {status: 400})
      }

      if (!userId) {
         return new NextResponse("Unauthenticated", {status: 401})
      }

      if (!params.storeId) {
         return new NextResponse("storeId required", {status: 401})

      }

      const storeByUserId = await prismadb.store.findFirst({
         where: {
            id: params.storeId, userId
         }
      })

      if (!storeByUserId) {
         return new NextResponse("Unauthorized", {status: 403})
      }

      const products = await prismadb.product.create({
         data: {
            name, price, categoryId, colorId, elementId, isFeatured, isArchived, storeId: params.storeId, images: {
               createMany: {
                  data: [...images.map((image: { url: string }) => image)]
               }
            }
         }
      });

      return NextResponse.json(products)

   } catch (error) {

      console.log(["products_POST"], error)

      return new NextResponse("Internal error ", {status: 500});
   }
}

export async function GET(req: Request, {params}: { params: { storeId: string } }) {
   try {

      const {searchParams} = new URL(req.url);
      const categoryId = searchParams.get("categoryId") || undefined;
      const colorId = searchParams.get("colorId") || undefined;
      const elementId = searchParams.get("elementId") || undefined;
      const isFeatured = searchParams.get("isFeatured");


      if (!params.storeId) {
         return new NextResponse("storeId required", {status: 401})
      }


      const products = await prismadb.product.findMany({
         where: {
            storeId: params.storeId, categoryId, colorId, elementId, isFeatured: isFeatured ? true : undefined, isArchived: false,
         }, include: {
            images: true, category: true, color: true, element: true,
         }, orderBy: {
            createdAt: "desc"
         }
      });

      return NextResponse.json(products)

   } catch (error) {

      console.log(["PRODUCTS_GET"], error)

      return new NextResponse("Internal error ", {status: 500});
   }
}