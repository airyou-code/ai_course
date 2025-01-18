import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import LessonList from '../../components/course/LessonList'
import { useFetchModuleData } from '../../hooks/courses'
import { Search } from 'lucide-react'
import LoadingPage from '../LoadingPage'


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
    return <LoadingPage />;
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex">
        <Sidebar lessonGroups={data} />
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
                className="w-full border border-slate-400  text-white placeholder-gray-500 rounded-lg py-3 pl-12 pr-4"
              />
              <Search className="absolute left-4 top-3.5 text-gray-500" />
            </div>
            <LessonList lessonGroups={data} />
          </div>
        </main>
      </div>
    </div>
  )
}



