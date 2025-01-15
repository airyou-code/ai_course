import LessonList from "./LessonList"

interface CurriculumProps {
  title?: string
  description?: string
}

export default function Curriculum({ 
  title = "The Curriculum",
  description = "In this section, I'll provide an overview of the Framer program and then we jump into setting up our file with colors, breakpoints, text styles, etc."
}: CurriculumProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <h3 className="text-2xl font-bold">The Foundations</h3>
        </div>
        <p className="text-gray-400">{description}</p>
      </div>
      <LessonList />
      <button className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg mt-4">
        All Lessons
      </button>
    </div>
  )
}

