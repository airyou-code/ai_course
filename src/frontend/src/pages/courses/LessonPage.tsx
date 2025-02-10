import { AppSidebar } from "@/components/app-sidebar"
import { SidebarRight } from "@/components/sidebar-right"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import LessonList from '../../components/course/LessonList'
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useFetchModuleData, useFetchLessonData } from '../../hooks/courses'
import CourseContent from '../../components/course/CourseContent'
import { Search } from 'lucide-react'
// import LoadingPage from '../LoadingPage'

export default function LessonPage() {
  const { data, isLoading, isError } = useFetchModuleData();
    const { lessonUUId } = useParams<{ lessonUUId: string }>();
  
    if (isLoading) {
      return null;
    }
  
    if (!lessonUUId) {
      return <div>Error: lessonUUId is undefined</div>;
    }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
          <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
          <div className="mx-auto w-full max-w-3xl">
            <CourseContent lessonUUId={lessonUUId}/>
          </div>
        </div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  )
}
