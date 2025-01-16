import { Play } from 'lucide-react'

interface Lesson {
  id: number
  title: string
  duration: string
  description: string
  isFree: boolean
}

const dummyLessons: Lesson[] = [
  {
    id: 1,
    title: "Intro to Framer",
    duration: "14:54",
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    isFree: true
  },
  {
    id: 2,
    title: "Design system styles",
    duration: "5:34",
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    isFree: true
  },
  {
    id: 3,
    title: "File setup",
    duration: "7:32",
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    isFree: true
  }
]

export default function LessonList() {
  return (
    <div className="space-y-4">
      {dummyLessons.map((lesson) => (
        <div key={lesson.id} className="bg-black border border-slate-600 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-bold">{lesson.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{lesson.duration}</span>
                  {lesson.isFree && (
                    <span className="bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded">
                      Free
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm">{lesson.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

