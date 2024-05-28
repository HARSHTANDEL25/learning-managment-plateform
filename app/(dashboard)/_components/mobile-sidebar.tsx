import { Menu } from 'lucide-react'
import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from './Sidebar';

///sheet to open the navbar when we click on mobile view we have sheet sheet triger which will o action 
///and menu is just wrap into it 

function Mobilesidebar() {
  return (
    <Sheet>
    <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">    
        <Menu/>
    </SheetTrigger>
    <SheetContent side="left" className="p-0 bg-white">
        <Sidebar />
    </SheetContent>
</Sheet>
    )
}

export default Mobilesidebar;