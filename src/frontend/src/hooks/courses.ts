import API from '../config/api';
import QUERY_KEYS from '../config/queries';
import { useRequest } from "./request";
import { useQuery, useQueryClient } from '@tanstack/react-query';


export const useFetchModuleData = () => {
    const request = useRequest();

    return useQuery({
        queryKey: [QUERY_KEYS.MODULE_DATA],
        queryFn: async () => {
            const { data } = await request(API.MODULE_DATA);
            return data
        }
    });
}


export const useFetchLessonData = (lesson_uuid: string) => {
    const request = useRequest();

    return useQuery({
        queryKey: [QUERY_KEYS.LESSON_DATA, lesson_uuid],
        queryFn: async () => {
            const { data } = await request(API.LESSON_DATA(lesson_uuid));
            return data
        },
        staleTime: 60 * 1000, // 1 minute
    });
}


export const useFetchNextLessonData = (lesson_uuid: string) => {
    const request = useRequest();
    
    return useQuery({
      queryKey: [QUERY_KEYS.LESSON_NEXT_DATA, lesson_uuid],
      queryFn: async () => {
        const { data } = await request(API.LESSON_NEXT_DATA(lesson_uuid));
        return data;
      },
      enabled: false // Query не будет выполняться автоматически
    });
  };


export const useFetchLessonHistory = (lesson_uuid: string) => {
    const request = useRequest();

    return useQuery({
        queryKey: [QUERY_KEYS.LESSON_PROGRESS, lesson_uuid],
        queryFn: async () => {
            const { data } = await request(API.LESSON_PROGRESS(lesson_uuid));
            return data
        },
        staleTime: 60 * 1000,  // 1 minute
    });
}