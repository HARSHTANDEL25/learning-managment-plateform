import { NavbarRoutes } from "@/components/navbar-routes";
import Mobilesidebar from "./mobile-sidebar"

import React from 'react'

function Navbar() {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <Mobilesidebar />
            <NavbarRoutes />
        </div>
  );
};

export default Navbar;