import CourseContent from '../../components/course/CourseContent'
import LayoutShadcn from "@/components/layout/LayoutShadcn"
import { LessonProgressProvider } from "@/reducers/LessonProgress"
import { StreamStatusProvider } from '@/reducers/StreamStatus'

export default function LessonPage() {
  return (
    <LessonProgressProvider>
        <LayoutShadcn>
          <StreamStatusProvider>
            <CourseContent />
          </StreamStatusProvider>
        </LayoutShadcn>
    </LessonProgressProvider>
  )
}
