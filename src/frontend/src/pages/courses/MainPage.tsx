import CourseInfo from '../../components/course/CourseInfo'
import Curriculum from '../../components/course/Curriculum'
import Navbar from '../../components/layout/Navbar'
import Hero from '../../components/layout/Hero'


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

const lessonGroups: LessonGroup[] = [
  {
    title: "The Foundations",
    description: "In this section, I'll provide an overview of the Framer program and then we jump into setting up our file with colors, breakpoints, text styles, etc.",
    lessons: [
      { title: "Intro to Framer", duration: "14:54", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: true, is_locked: false },
      { title: "Design system styles", duration: "5:34", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: true, is_locked: false },
      { title: "File setup", duration: "7:32", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: true, is_locked: false },
    ]
  },
  {
    title: "Designing",
    description: "In this section, we'll dive into designing pages and understanding the fundamental features that make Framer pages work.",
    lessons: [
      { title: "Using components", duration: "9:49", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: false, is_locked: true },
      { title: "Creating sections", duration: "5:52", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: false, is_locked: true },
      { title: "How to use stacks and frames", duration: "3:46", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: false, is_locked: true },
      { title: "Importing from figma", duration: "8:12", description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.", is_free: false, is_locked: true },
    ]
  },
  {
    title: "Jazzing it Up",
    description: "In this section, we'll dive into designing pages and understanding the fundamental features that make Framer pages work.",
    lessons: [
      { title: "Interactivity and animations", duration: "2:49", description: " ", is_free: false, is_locked: true },
      { title: "Overrides & code components", duration: "19:45", description: " ", is_free: false, is_locked: true },
      { title: "Blog & CMS", duration: "9:56", description: " ", is_free: false, is_locked: true },
      { title: "Publishing", duration: "6:40", description: " ", is_free: false, is_locked: true },
    ]
  }
]

export default function MainPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <div className="p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <CourseInfo />
            </div>
            <div className="md:col-span-2">
              <Curriculum lessonGroups={lessonGroups}/>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
