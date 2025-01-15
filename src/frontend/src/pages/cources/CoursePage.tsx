import CourseInfo from '../../components/course/CourseInfo'
import Curriculum from '../../components/course/Curriculum'
import Navbar from '../../components/layout/Navbar'
import Hero from '../../components/layout/Hero'

export default function CoursePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <div className="p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <CourseInfo />
          </div>
          <div className="md:col-span-2">
            <Curriculum />
          </div>
        </div>
      </div>
    </div>
  )
}
