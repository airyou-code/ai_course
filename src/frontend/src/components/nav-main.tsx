import { ChevronRight, type LucideIcon } from "lucide-react"
import { useFetchModuleData } from '@/hooks/courses';
import { BookOpen, Lock, SquareTerminal } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  icon?: LucideIcon
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
  lessons: Lesson[]
}

interface Group {
  title: string
  description: string
  modules: Module[]
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { data, isLoading, isError } = useFetchModuleData();

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <>
      {data.map((group, groupIndex) => (
        <SidebarGroup key={groupIndex}>
          <div>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.modules.map((module, moduleIndex) => (
                <Collapsible key={moduleIndex} asChild defaultOpen={module.isActive}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={module.title}>
                      <a href={module.url}>
                        {module.icon ? <module.icon /> : <BookOpen />}
                        <span>{module.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {module.lessons?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {module.lessons?.map((lesson, lessonIndex) => (
                              <SidebarMenuSubItem key={lessonIndex}>
                                <SidebarMenuSubButton asChild>
                                  <Link to={`/lesson/${lesson.uuid}`}>
                                    <span>{lesson.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </div>
        </SidebarGroup>
      ))}
    </>
  )
}
