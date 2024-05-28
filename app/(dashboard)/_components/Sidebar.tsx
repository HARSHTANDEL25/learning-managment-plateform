import React from 'react'
import { Logo } from './logo'
import SidebarRoutes from './sidebar-routes'

function Sidebar() {
  return (
    <div className={`h-full border-r flex flex-col overflow-y-auto bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white`}>
        <div className="p-6">
                <Logo />
        </div>
        <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
    </div>
  )
}

export default Sidebar