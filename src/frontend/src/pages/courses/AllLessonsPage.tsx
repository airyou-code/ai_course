import LayoutShadcn from "@/components/layout/LayoutShadcn"
import LessonList from '../../components/course/LessonList';
import { useFetchModuleData } from '../../hooks/courses';

export default function AllLessonsPage() {
  const { data, isLoading, isError } = useFetchModuleData();
  if (isLoading) {
    return null;
  }
  return (
    <LayoutShadcn>
      <LessonList lessonGroups={data} />
    </LayoutShadcn>
  );
}