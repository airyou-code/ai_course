import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LayoutShadcn from "@/components/layout/LayoutShadcn";
import CourseGroups from "@/components/course/course-card";
import { useFetchModuleData } from '../../hooks/courses';

export default function AllLessonsPage() {
  // const { data, isLoading, isError } = useFetchModuleData();
  const location = useLocation();

  useEffect(() => {
    // Add check for root path
    if (location.pathname === "/" && location.search) {
      const params = new URLSearchParams(location.search);
      const gIndex = params.get("g");
      const mIndex = params.get("m");
      
      if (gIndex && mIndex) {
        setTimeout(() => {
          const el = document.getElementById(`module-${gIndex}-${mIndex}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 0);
      }
    }
  }, [location.search, location.pathname]);

  return (
    <LayoutShadcn>
      <CourseGroups />
    </LayoutShadcn>
  );
}