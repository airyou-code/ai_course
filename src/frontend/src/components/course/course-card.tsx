import { CheckCircle, BookOpen, Lock } from "lucide-react"
import { Progress } from "../ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from 'react-router-dom'

interface LessonProps {
  uuid: string
  title: string
  isFree: boolean
  is_completed: boolean
  is_locked: boolean
  progress: number
}

interface ModuleProps {
  id: string
  title: string
  description: string
  lessons: LessonProps[]
}

interface Group {
  title: string
  description: string
  modules: ModuleProps[]
}

export function LessonItem({ lesson }: { lesson: LessonProps }) {
  return (
    <div className="flex items-start gap-4 p-5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors rounded-md dark:hover:bg-zinc-800/50">
      <div className="mt-1">
        {lesson.is_locked ? (
          <Lock className="h-6 w-6 text-muted-foreground" />
        ) : (
          <BookOpen className="h-6 w-6 text-primary" />
        )}
      </div>

      <div className="flex-1 space-y-1">
        <div className="font-medium dark:text-zinc-200">{lesson.title}</div>
        {lesson.progress > 0 && lesson.progress < 100 && !lesson.is_completed && (
          <div className="flex items-center gap-2 pt-2">
            <Progress value={lesson.progress} className="h-2 flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">{lesson.progress}%</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">

        {lesson.is_completed ? (
          <Button
            variant="outline"
            className="rounded-full w-10 h-10 p-0 bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800"
          >
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="sr-only">Completed</span>
          </Button>
        ) : lesson.is_locked ? (
          <Button variant="outline" className="rounded-full w-10 h-10 p-0" disabled>
            <Lock className="h-5 w-5" />
            <span className="sr-only">Locked</span>
          </Button>
        ) : (
          <Link
            to={`/lesson/${lesson.uuid}`}
          >
            <Button className="font-medium px-6">Start</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export function CourseModule({ module }: { module: ModuleProps }) {
  const completedLessons = module.lessons.filter((lesson) => lesson.is_completed).length
  const totalLessons = module.lessons.length
  const moduleProgress = Math.round((completedLessons / totalLessons) * 100)

  return (
    <Card className="mb-8 border-none shadow-md dark:bg-zinc-900">
      <CardHeader className="bg-zinc-900 text-white rounded-t-lg p-6 space-y-3 dark:bg-zinc-800">
        <CardTitle className="text-xl font-bold">{module.title}</CardTitle>
        <CardDescription className="text-zinc-300 text-base">{module.description}</CardDescription>

        <div className="pt-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-300">Прогресс модуля</span>
            <span className="text-sm font-medium text-green-400">{moduleProgress}%</span>
          </div>
          <Progress value={moduleProgress} className="h-2 bg-zinc-700" indicatorClassName="bg-green-500" />
          <div className="text-sm text-zinc-400 pt-1">
            {completedLessons} из {totalLessons} уроков завершено
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border dark:divide-zinc-700">
        {module.lessons.map((lesson) => (
          <LessonItem key={lesson.uuid} lesson={lesson} />
        ))}
      </CardContent>
    </Card>
  )
}


export default function CourseGroups({
  lessonGroups,
}: {
  lessonGroups: Group[];
}) {
  return (
    <div className="min-h-screen dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {lessonGroups.map((group, groupIndex) => (
      <div className="max-w-4xl mx-auto my-1" key={groupIndex}>
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">{group.title}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {group.description}
          </p>
        </div>

        <div className="space-y-8">
          {group.modules.map((module) => (
            <CourseModule key={module.id} module={module} />
          ))}
        </div>
      </div>
      ))}
    </div>
  )
}