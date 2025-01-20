import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import LessonList from '../../components/course/LessonList'
import { useFetchModuleData } from '../../hooks/courses'
import { Search } from 'lucide-react'
// import LoadingPage from '../LoadingPage'


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


export default function AllLessonsPage() {
  const { data, isLoading, isError } = useFetchModuleData();
  if (isLoading) {
    return null;
  }
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex">
        <Sidebar lessonGroups={data} />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {/* <h1 className="text-4xl font-bold mb-8">All Lessons</h1> */}
            <LessonList lessonGroups={data} />
          </div>
        </main>
      </div>
    </div>
  )
}



