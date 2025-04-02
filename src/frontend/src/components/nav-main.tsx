import { ChevronRight, type LucideIcon } from "lucide-react"
import { useFetchModuleData } from '@/hooks/courses';
import { BookOpen } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NavSkeleton } from "./nav-skeleton";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface Lesson {
  title: string
  duration: string
  description: string
  is_free: boolean
  is_locked: boolean
  uuid: string
  is_completed?: boolean
}

interface Module {
  title: string
  description: string
  icon?: LucideIcon
  url?: string
  lessons: Lesson[]
}

interface Group {
  title: string
  description: string
  modules: Module[]
}

export function NavMain() {
  const { data, isLoading, isError } = useFetchModuleData();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) return <NavSkeleton />;
  if (isError) return <div>Error loading data</div>;

  function scrollToModule(groupIndex: number, moduleIndex: number) {
    const elementId = `module-${groupIndex}-${moduleIndex}`;
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleModuleClick(groupIndex: number, moduleIndex: number) {
    if (location.pathname === "/") {
      scrollToModule(groupIndex, moduleIndex);
    } else {
      navigate(`/?g=${groupIndex}&m=${moduleIndex}`);
    }
  }

  return (
    <>
      {data.map((group: Group, groupIndex: number) => (
        <SidebarGroup key={groupIndex}>
          <div>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.modules.map((module, moduleIndex) => (
                <SidebarMenuItem key={moduleIndex}>
                  <SidebarMenuButton asChild tooltip={module.title}>
                    <button
                      onClick={() => handleModuleClick(groupIndex, moduleIndex)}
                      className="flex items-center space-x-2 w-full text-left"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>
                      {
                        module.title.includes('$')
                          ? module.title.replace('$', (moduleIndex + 1).toString())
                          : module.title
                      }
                      </span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </SidebarGroup>
      ))}
    </>
  )
}
