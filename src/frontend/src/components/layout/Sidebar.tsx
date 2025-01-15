import { Search } from 'lucide-react'

interface LessonGroup {
  title: string
  lessons: {
    title: string
    duration: string
    isFree: boolean
    isLocked: boolean
  }[]
}

const lessonGroups: LessonGroup[] = [
  {
    title: "Fundamentals",
    lessons: [
      { title: "Intro to Framer", duration: "14:54", isFree: true, isLocked: false },
      { title: "Design system styles", duration: "5:34", isFree: true, isLocked: false },
      { title: "File setup", duration: "7:32", isFree: true, isLocked: false },
    ]
  },
  {
    title: "Designing",
    lessons: [
      { title: "Using components", duration: "9:49", isFree: false, isLocked: true },
      { title: "Creating sections", duration: "5:52", isFree: false, isLocked: true },
      { title: "How to use stacks and frames", duration: "3:46", isFree: false, isLocked: true },
      { title: "Importing from figma", duration: "8:12", isFree: false, isLocked: true },
    ]
  },
  {
    title: "Jazzing it Up",
    lessons: [
      { title: "Interactivity and animations", duration: "2:49", isFree: false, isLocked: true },
      { title: "Overrides & code components", duration: "19:45", isFree: false, isLocked: true },
      { title: "Blog & CMS", duration: "9:56", isFree: false, isLocked: true },
      { title: "Publishing", duration: "6:40", isFree: false, isLocked: true },
    ]
  }
]

export default function Sidebar() {
  return (
    <div className="w-80 bg-gray-900 h-screen overflow-y-auto p-4">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search lessons..."
          className="w-full bg-black text-white placeholder-gray-500 rounded-lg py-2 pl-10 pr-4"
        />
        <Search className="absolute left-3 top-2.5 text-gray-500" />
      </div>
      <button className="w-full bg-gray-800 text-white font-bold py-2 rounded-lg mb-4">
        All Lessons
      </button>
      <div className="mb-4">
        <h3 className="text-gray-500 font-bold mb-2">Progress</h3>
        <div className="flex space-x-1">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="w-6 h-2 bg-gray-700 rounded-full" />
          ))}
        </div>
      </div>
      {lessonGroups.map((group, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-white font-bold mb-2">{group.title}</h3>
          {group.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex} className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">{lesson.title}</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-xs">{lesson.duration}</span>
                {lesson.isFree && (
                  <span className="bg-purple-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                    Free
                  </span>
                )}
                {lesson.isLocked && (
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

