import LessonList from "./LessonList"


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
interface CurriculumProps {
  title?: string
  description?: string,
  lessonGroups?: Group[]
}

export default function Curriculum({ 
  title = "The Curriculum",
  lessonGroups = []
}: CurriculumProps) {
  return (
    <div>
      <h2 className="text-3xl mb-6">{title}</h2>
      <LessonList lessonGroups={lessonGroups} />
      <button className="w-full bg-gray-800 text-white py-3 rounded-lg mt-4">
        All Lessons
      </button>
    </div>
  )
}

