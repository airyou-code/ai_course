import { BookOpen, Lock, CheckCircle, ChevronRight } from 'lucide-react'

interface Lesson {
  title: string
  duration: string
  description: string
  is_free: boolean
  is_locked: boolean
  is_completed?: boolean
}

interface LessonGroup {
  title: string
  description: string
  lessons: Lesson[]
}

export default function LessonList({
  lessonGroups,
}: {
  lessonGroups: LessonGroup[];
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-text">Modules</h1>
      {lessonGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="bg-surface rounded-lg shadow overflow-hidden border">
          <div className="bg-zinc-800 text-white p-4">
            <h2 className="text-xl font-semibold">{group.title}</h2>
            <p className="text-sm text-gray-300">{group.description}</p>
          </div>
          <div className="divide-y divide-gray-200">
            {group.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3 px-1">
                  {lesson.is_locked ? (
                    <Lock className="w-8 h-8 text-zinc-800" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-zinc-800" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-text">{lesson.title}</h3>
                    <p className="text-sm text-text-secondary">{lesson.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* <span className="text-gray-400 text-sm">{lesson.duration}</span> */}
                  {lesson.is_free && (
                    <span className="bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded">
                      Free
                    </span>
                  )}
                  {lesson.is_completed ? (
                    <CheckCircle className="w-6 h-6 text-secondary" />
                  ) : lesson.is_locked ? (
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  ) : (
                    <button className="px-5 py-2 bg-zinc-800 text-white rounded-md text-sm">
                      Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
