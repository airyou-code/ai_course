import { BookOpen, Lock, CheckCircle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import API from '../../config/api'

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
  lessons: Lesson[]
}

interface Group {
  title: string
  description: string
  modules: Module[]
}

export default function LessonList({
  lessonGroups,
}: {
  lessonGroups: Group[];
}) {
  return (
    <div className="space-y-6">
      {lessonGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
        <h1 className="text-4xl font-bold text-text">{group.title}</h1>
        {group.modules.map((module, modulesIndex) => (
        <div key={modulesIndex} className="mt-5 bg-surface rounded-lg shadow overflow-hidden border">
          <div className="bg-zinc-800 text-white p-4">
            <h2 className="text-xl font-semibold">
            {
              module.title.includes('$')
                ? module.title.replace('$', modulesIndex.toString())
                : module.title
            }
            </h2>
            <p className="text-sm text-gray-300">{module.description}</p>
          </div>
          <div className="divide-y divide-gray-200">
            {module.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3 px-1">
                  {lesson.is_locked ? (
                    <Lock style={{ width: '2rem', height: '2rem', display: 'inline-block', verticalAlign: 'middle' }} className="w-8 h-8 text-zinc-800" />
                  ) : (
                    <BookOpen style={{ width: '2rem', height: '2rem', display: 'inline-block', verticalAlign: 'middle' }} className="w-8 h-8 text-zinc-800" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-text">
                    {
                      lesson.title.includes('$')
                        ? lesson.title.replace('$', lessonIndex.toString())
                        : lesson.title
                    }
                    </h3>
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
                    <Link
                      to={`/lesson/${lesson.uuid}`}
                    >
                      <button className="px-5 py-2 bg-zinc-800 text-white rounded-md text-sm">
                        Start
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
      ))}
    </div>
  )
}
