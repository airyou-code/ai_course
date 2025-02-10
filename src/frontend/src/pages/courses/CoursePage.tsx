import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import LessonList from '../../components/course/LessonList'
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useFetchModuleData, useFetchLessonData } from '../../hooks/courses'
import CourseContent from '../../components/course/CourseContent'
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
  const { lessonUUId } = useParams<{ lessonUUId: string }>();

  if (isLoading) {
    return null;
  }

  if (!lessonUUId) {
    return <div>Error: lessonUUId is undefined</div>;
  }

  return (
    // <Layout lessonGroups={data}>
    //   <CourseContent lessonUUId={lessonUUId}/>
    // </Layout>
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <div className="flex flex-1 mt-20">
        <Sidebar lessonGroups={data} />
        <CourseContent />
      </div>
    </div>
  )
}



