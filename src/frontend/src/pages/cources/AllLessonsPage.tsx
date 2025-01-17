import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import LessonList from '../../components/course/LessonList'
import { Search } from 'lucide-react'


interface Lesson {
  title: string
  duration: string
  description: string
  isFree: boolean
  isLocked: boolean
}

interface LessonGroup {
  title: string
  description: string
  lessons: Lesson[]
}

const lessonGroups: LessonGroup[] = [
  {
    title: "The Foundations",
    description: "In this section, I'll provide an overview of the Framer program and then we jump into setting up our file with colors, breakpoints, text styles, etc.",
    lessons: [
      { title: "Intro to Framer", duration: "14:54", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", isFree: true, isLocked: false },
      { title: "Design system styles", duration: "5:34", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", isFree: true, isLocked: false },
      { title: "File setup", duration: "7:32", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", isFree: true, isLocked: false },
    ]
  },
  {
    title: "Designing",
    description: "In this section, we'll dive into designing pages and understanding the fundamental features that make Framer pages work.",
    lessons: [
      { title: "Using components", duration: "9:49", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", isFree: false, isLocked: true },
      { title: "Creating sections", duration: "5:52", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", isFree: false, isLocked: true },
      { title: "How to use stacks and frames", duration: "3:46", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", isFree: false, isLocked: true },
      { title: "Importing from figma", duration: "8:12", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", isFree: false, isLocked: true },
    ]
  },
  {
    title: "Jazzing it Up",
    description: "In this section, we'll dive into designing pages and understanding the fundamental features that make Framer pages work.",
    lessons: [
      { title: "Interactivity and animations", duration: "2:49", description: " ", isFree: false, isLocked: true },
      { title: "Overrides & code components", duration: "19:45", description: " ", isFree: false, isLocked: true },
      { title: "Blog & CMS", duration: "9:56", description: " ", isFree: false, isLocked: true },
      { title: "Publishing", duration: "6:40", description: " ", isFree: false, isLocked: true },
    ]
  }
]


export default function AllLessonsPage() {

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex">
        <Sidebar lessonGroups={lessonGroups} />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">All Lessons</h1>
            <div className="mb-8">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-15%20at%2013.31.33-tJyENFTgDJjPCXHCrdUmYuyhZp1sc9.png"
                alt="Course workspace"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search lessons..."
                className="w-full bg-gray-900 text-white placeholder-gray-500 rounded-lg py-3 pl-12 pr-4"
              />
              <Search className="absolute left-4 top-3.5 text-gray-500" />
            </div>
            <LessonList lessonGroups={lessonGroups} />
          </div>
        </main>
      </div>
    </div>
  )
}



