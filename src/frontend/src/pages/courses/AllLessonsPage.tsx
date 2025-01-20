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
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Navbar всегда наверху */}
      <Navbar />
      <div className="flex flex-1 mt-20">
        {/* Sidebar фиксирован, прокручивается только контент */}
        <Sidebar lessonGroups={data} />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
          <LessonList lessonGroups={data} />
          </div>
        </main>
      </div>
    </div>
  )
}



