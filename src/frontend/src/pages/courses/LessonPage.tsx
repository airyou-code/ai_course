import CourseContent from '../../components/course/CourseContent'
import LayoutShadcn from "@/components/layout/LayoutShadcn"
import { LessonProgressProvider } from "@/reducers/LessonProgress"

export default function LessonPage() {
  return (
    <LessonProgressProvider>
      <LayoutShadcn>
        <CourseContent />
      </LayoutShadcn>
    </LessonProgressProvider>
  )
}
