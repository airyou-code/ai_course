import { Skeleton } from "@/components/ui/skeleton"
import {
   Card, CardContent, CardHeader
} from "@/components/ui/card"

// ------------------- LessonItemSkeleton -------------------
function LessonItemSkeleton() {
  return (
    <div className="flex items-start gap-4 p-5 border-b border-border last:border-0">
      <div className="mt-1">
        <Skeleton className="h-6 w-6 rounded" />
      </div>

      <div className="flex-1 space-y-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-2 w-full mt-4" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  )
}

// ------------------- CourseModuleSkeleton -------------------
function CourseModuleSkeleton() {
  return (
    <Card className="mb-8 border-none shadow-md dark:bg-zinc-900">
      <CardHeader className="bg-zinc-900 text-white rounded-t-lg p-6 space-y-3 dark:bg-zinc-800">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-5 w-full" />

        <div className="pt-2 space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border dark:divide-zinc-700">
        {[1, 2, 3].map((i) => (
          <LessonItemSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  )
}

// ------------------- CourseGroupsSkeleton -------------------
export function CourseGroupsSkeleton() {
  return (
    <div className="min-h-screen dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {[1, 2].map((groupIndex) => (
        <div className="max-w-4xl mx-auto my-1" key={groupIndex}>
          <div className="mb-10">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          <div className="space-y-8">
            {[1, 2].map((moduleIndex) => (
              <div key={moduleIndex}>
                <CourseModuleSkeleton />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}