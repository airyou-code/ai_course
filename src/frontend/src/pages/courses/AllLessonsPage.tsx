import Layout from '../../components/layout/Layout';
import LessonList from '../../components/course/LessonList';
import { useFetchModuleData } from '../../hooks/courses';

export default function AllLessonsPage() {
  const { data, isLoading, isError } = useFetchModuleData();
  if (isLoading) {
    return null;
  }
  return (
    <Layout lessonGroups={data}>
      <LessonList lessonGroups={data} />
    </Layout>
  );
}