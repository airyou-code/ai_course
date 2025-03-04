import LayoutShadcn from "@/components/layout/LayoutShadcn"
import LessonList from '../../components/course/LessonList';
import CourseGroups from "@/components/course/course-card";
import { useFetchModuleData } from '../../hooks/courses';

export default function AllLessonsPage() {
  const { data, isLoading, isError } = useFetchModuleData();
  if (isLoading) {
    return null;
  }
  return (
    <LayoutShadcn>
      <CourseGroups lessonGroups={data} />
    </LayoutShadcn>
  );
}