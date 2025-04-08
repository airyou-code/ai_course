import { AppSidebar } from "@/components/app-sidebar"
import React, { useContext } from "react"
import { SidebarRight } from "@/components/sidebar-right"
import { Link, useParams } from 'react-router-dom'
import { LessonProgressContext } from "@/reducers/LessonProgress"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "../mode-toggle"
import NavBreadcrumb from "../nav-bread-crumb"

export default function LayoutShadcn({ children }: React.PropsWithChildren) {

  const lessonProgressContext = useContext(LessonProgressContext)

  return (
    <SidebarProvider>
      <div className="fixed inset-0 flex">
        <AppSidebar className="fixed left-0 top-0 h-full" />
        <SidebarInset className="flex-1 overflow-hidden">
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <NavBreadcrumb />
            </div>
            <div className="px-2">
              <ModeToggle />
            </div>
            {lessonProgressContext && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                <div
                  style={{ width: `${lessonProgressContext.progress}%` }}
                  className="h-full bg-green-500 transition-all duration-300"
                />
              </div>
            )}
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
