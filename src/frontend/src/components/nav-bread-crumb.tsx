import { Link, useParams } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchModuleData } from '@/hooks/courses';
import { useIsMobile } from '@/hooks/use-mobile';

// Update the truncateText function to be responsive
const truncateText = (text: string, isMobile: boolean) => {
  const maxLength = isMobile ? 15 : 25; // Shorter text on mobile
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

function BreadcrumbSkeleton({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="w-full animate-pulse flex items-center gap-2">
      {/* Home - always visible */}
      <div className="h-4 w-12 bg-muted rounded" />
      
      <div className="h-4 w-4 text-muted-foreground">/</div>
      
      {/* Desktop: Course + Module + Lesson */}
      {!isMobile ? (
        <>
          {/* Course */}
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-4 text-muted-foreground">/</div>
          
          {/* Module */}
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-4 w-4 text-muted-foreground">/</div>
        </>
      ) : null}
      
      {/* Lesson - always visible */}
      <div className="h-4 w-40 bg-muted rounded" />
    </div>
  );
}

export default function NavBreadcrumb() {
  const { data, isLoading, isError } = useFetchModuleData()
  const isMobile = useIsMobile()

  // 2. Считываем lessonUUId из URL (например, /lesson/:lessonUUId)
  const { lessonUUId } = useParams()
  console.log('lessonUUId', lessonUUId)

  // Если идёт загрузка — показываем Skeleton
  if (isLoading) {
    return <BreadcrumbSkeleton isMobile={isMobile} />;
  }
  // Если ошибка или нет данных
  if (isError || !data) {
    return <div>Error or no data</div>
  }

  // 3. Ищем, в каком курсе (Group) и модуле (Module) находится этот lessonUUId
  let courseTitle: string | null = null
  let moduleTitle: string | null = null
  let lessonTitle: string | null = null

  // Заодно найдём индексы, чтобы формировать ссылку вида "/?g=X&m=Y"
  let foundGroupIndex: number | null = null
  let foundModuleIndex: number | null = null

  if (lessonUUId) {
    // Перебираем группы, модули, уроки
    outerLoop: for (let gi = 0; gi < data.length; gi++) {
      const group = data[gi]
      for (let mi = 0; mi < group.modules.length; mi++) {
        const mod = group.modules[mi]
        for (let li = 0; li < mod.lessons.length; li++) {
          const lesson = mod.lessons[li]
          if (lesson.uuid === lessonUUId) {
            courseTitle = group.title
            moduleTitle = mod.title.includes('$')
              ? mod.title.replace('$', (mi + 1).toString())
              : mod.title
            lessonTitle = lesson.title.includes('$')
              ? lesson.title.replace('$', (li + 1).toString())
              : lesson.title
            foundGroupIndex = gi
            foundModuleIndex = mi
            break outerLoop
          }
        }
      }
    }
  }


  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-wrap font-breadcrumbs">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {lessonUUId && courseTitle && moduleTitle && (
          <>
            <BreadcrumbSeparator />
            {!isMobile && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link 
                      to={`/?g=${foundGroupIndex}&m=0`}
                      title={courseTitle}
                      className="text-sm md:text-base"
                    >
                      {truncateText(courseTitle, isMobile)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link 
                      to={`/?g=${foundGroupIndex}&m=${foundModuleIndex}`}
                      title={moduleTitle}
                      className="text-sm md:text-base"
                    >
                      {truncateText(moduleTitle, isMobile)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {lessonTitle && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage 
                    title={lessonTitle}
                    className="text-sm md:text-base"
                  >
                    {truncateText(lessonTitle, isMobile)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}