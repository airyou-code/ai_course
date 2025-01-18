import { Play, Lock } from 'lucide-react'

interface Lesson {
  title: string
  duration: string
  description: string
  is_free: boolean
  is_locked: boolean
}

interface LessonGroup {
  title: string
  description: string
  lessons: Lesson[]
}

// const lessonGroups: LessonGroup[] = [
//   {
//     title: "The Foundations",
//     description: "In this section, I'll provide an overview of the Framer program and then we jump into setting up our file with colors, breakpoints, text styles, etc.",
//     lessons: [
//       { title: "Intro to Framer", duration: "14:54", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: true, is_locked: false },
//       { title: "Design system styles", duration: "5:34", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: true, is_locked: false },
//       { title: "File setup", duration: "7:32", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: true, is_locked: false },
//     ]
//   },
//   {
//     title: "Designing",
//     description: "In this section, we'll dive into designing pages and understanding the fundamental features that make Framer pages work.",
//     lessons: [
//       { title: "Using components", duration: "9:49", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: false, is_locked: true },
//       { title: "Creating sections", duration: "5:52", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: false, is_locked: true },
//       { title: "How to use stacks and frames", duration: "3:46", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: false, is_locked: true },
//       { title: "Importing from figma", duration: "8:12", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: false, is_locked: true },
//     ]
//   },
// ]

export default function LessonList({
  lessonGroups,
}: {
  lessonGroups: LessonGroup[];
}) {
  return (
    <div className="space-y-8">
      {lessonGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="border border-slate-400  rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-2xl font-bold">{group.title}</h3>
          </div>
          <p className="text-gray-400 mb-6">{group.description}</p>
          <div className="space-y-4">
            {group.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="border border-slate-400 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    {lesson.is_locked ? (
                      <Lock className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold">{lesson.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">{lesson.duration}</span>
                        {lesson.is_free && (
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
        </div>
      ))}
    </div>
  )
}

