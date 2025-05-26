import React, { useState } from "react"
import ROUTES from "@/config/routes"
import { useNavigate } from "react-router-dom"
import { CheckCircle, BookOpen, Lock, LockIcon, CheckIcon } from "lucide-react"
import { Progress } from "../ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from 'react-router-dom'
import { useFetchModuleData } from '../../hooks/courses';
import { CourseGroupsSkeleton } from "./course-skeleton"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

interface GroupProps {
  title: string
  description: string
  modules: ModuleProps[]
}

// ------------------- LessonItem -------------------
export function LessonItem({ lesson, lessonIndex }: { lesson: LessonProps; lessonIndex: number }) {
  const { t } = useTranslation()
  const navigate = useNavigate();

  const [hovered, setHovered] = useState(false)
  const [openModal, setOpenModal] = useState(false)


  const handleClick = () => {
    if (lesson.is_locked) {
      setOpenModal(true)
    }
    // иначе пусть <Link> обрабатывает переход по ссылке
  }

  const redirectToPayment = () => {
    // Перенаправление на форму оплаты
    window.location.href = ROUTES.PAYMENT;
  }

  return (
    <>
      <div
        className="relative flex items-start gap-4 p-5 border-b border-border last:border-0 transition-colors rounded-md dark:hover:bg-zinc-800/50"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        <div className="mt-1">
          {lesson.is_locked ? (
            <Lock className="h-6 w-6 text-muted-foreground" />
          ) : (
            <BookOpen className="h-6 w-6 text-primary" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="font-medium dark:text-zinc-200">
            {lesson.title.includes('$')
              ? lesson.title.replace('$', (lessonIndex + 1).toString())
              : lesson.title}
          </div>
          {lesson.progress > 0 && lesson.progress < 100 && !lesson.is_completed && (
            <div className="flex items-center gap-2 pt-2">
              <Progress value={lesson.progress} className="h-2 flex-1" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {lesson.progress}%
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {lesson.is_locked ? (
            <Button variant="outline" className="rounded-full w-10 h-10 p-0" disabled>
              <Lock className="h-5 w-5" />
              <span className="sr-only">{t('course.locked')}</span>
            </Button>
          ) : lesson.is_completed ? (
            <Link to={`/lesson/${lesson.uuid}`}>
              <Button
                variant="outline"
                className="px-8 bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800"
              >
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="sr-only">{t('course.completed')}</span>
              </Button>
            </Link>
          ) : (
            <Link to={`/lesson/${lesson.uuid}`}>
              <Button className="font-medium px-6">{t('course.start')}</Button>
            </Link>
          )}
        </div>

        {/* Hover overlay for locked lessons */}
        {hovered && lesson.is_locked && (
          <div className="cursor-pointer absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[1px]">
            <span className="text-sm cursor-pointer font-medium px-4 py-2 rounded-full bg-primary/10 text-primary">
              Нажмите, чтобы узнать о полном доступе
            </span>
          </div>
        )}
      </div>

      {/* Modal dialog for purchase */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">Доступ закрыт</DialogTitle>
              <DialogDescription className="text-base">
                Этот урок доступен только в полной версии курса. Приобретите полный доступ, чтобы разблокировать все
                уроки и материалы.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Что вы получите с полным доступом:
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-start space-x-3">
                    <CheckIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">4 подробных урока</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">По генеративному ИИ</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">Практические задания</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">И готовые шаблоны</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">Пожизненный доступ</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">К материалам и обновлениям</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">Сертификат</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">О прохождении курса</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-4 text-center">
                <h3 className="text-xl font-bold mb-1">₽4,990</h3>
                <p className="text-gray-300 dark:text-gray-700 text-sm">Единоразовый платеж • Пожизненный доступ</p>
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Отмена
            </Button>
            <Button onClick={() => window.location.assign(ROUTES.PAYMENT)}>
              Купить полный доступ
            </Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  )
}

// ------------------- CourseModule -------------------
export function CourseModule({ module, moduleIndex }: { module: ModuleProps, moduleIndex: number }) {
  const { t } = useTranslation();
  const completedLessons = module.lessons.filter((lesson) => lesson.is_completed).length
  const totalLessons = module.lessons.length
  const moduleProgress = Math.round((completedLessons / totalLessons) * 100)

  return (
    <Card className="mb-8 border-none shadow-md dark:bg-zinc-900">
      <CardHeader className="bg-zinc-900 text-white rounded-t-lg p-6 space-y-3 dark:bg-zinc-800">
        <CardTitle className="text-xl font-bold">
          {
            module.title.includes('$')
              ? module.title.replace('$', (moduleIndex + 1).toString())
              : module.title
          }
        </CardTitle>
        <CardDescription className="text-zinc-300 text-base">
          {module.description}
        </CardDescription>

        <div className="pt-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-300">
              {t('course.moduleProgress')}
            </span>
            <span className="text-sm font-medium text-green-400">
              {moduleProgress}%
            </span>
          </div>
          <Progress
            value={moduleProgress}
            className="h-2 bg-zinc-700"
            indicatorClassName="bg-green-500"
          />
          <div className="text-sm text-zinc-400 pt-1">
            {t('course.lessonsCompleted', { completed: completedLessons, total: totalLessons })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border dark:divide-zinc-700">
        {module.lessons.map((lesson, lessonIndex: number) => (
          <div key={`lesson-${moduleIndex}-${lessonIndex}`} id={`lesson-${moduleIndex}-${lessonIndex}`}>
            <LessonItem lessonIndex={lessonIndex} lesson={lesson} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ------------------- CourseGroups -------------------
export default function CourseGroups() {
  const { t } = useTranslation();
  const { data: lessonGroups, isLoading, isError } = useFetchModuleData();
  
  if (isLoading) return <CourseGroupsSkeleton />;
  if (isError) return <div>{t('course.errorLoading')}</div>;

  return (
    <div className="min-h-screen dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {lessonGroups.map((group: GroupProps, groupIndex: number) => (
        <div
          key={group.title || `group-${groupIndex}`}  // ← можно использовать уникальное поле
          id={`group-${groupIndex}`}
        >
          <div className="max-w-4xl mx-auto my-1" key={`group-${groupIndex}`} id={`group-${groupIndex}`}>
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
                {group.title}
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {group.description}
              </p>
            </div>

            <div className="space-y-8">
              {group.modules.map((module: ModuleProps, moduleIndex: number) => (
                <div
                  key={`module-${groupIndex}-${moduleIndex}`}
                  id={`module-${groupIndex}-${moduleIndex}`}
                >
                  <CourseModule module={module} moduleIndex={moduleIndex}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
