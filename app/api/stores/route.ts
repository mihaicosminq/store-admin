import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
   try {

      const {userId} = auth();
      const body = await req.json();
      const {name} = body;

      if (!name) {
         return new NextResponse("name is required", {status: 400})
      }

      if (!userId) {
         return new NextResponse("Unauthenticated", {status: 401})
      }

      const store = await prismadb.store.create({
         data: {name, userId}
      });

      return NextResponse.json(store)

   } catch (error) {

      console.log(["STORES_POST"], error)

      return new NextResponse("Internal error ", {status: 500});
   }
}