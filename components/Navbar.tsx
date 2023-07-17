// @flow
import * as React from 'react';
import {auth, UserButton} from "@clerk/nextjs";
import {MainNav} from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import {redirect} from "next/navigation";
import prismadb from "@/lib/prismadb";


export const Navbar = async () => {

   const {userId} = auth();
   if (!userId) {
      redirect("/login")
   }
   const stores = await prismadb.store.findMany({
      where: {
         userId,
      }
   });

   return (
      <div className="border-b">
         <div className="flex h-16 items-center px-4">
            <StoreSwitcher items={stores}/>
            <MainNav/>
            <div className="ml-auto flex items-center space-x-4">
               <UserButton afterSignOutUrl="/"/>
            </div>
         </div>
      </div>
   );
};

