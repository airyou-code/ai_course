import API from '../config/api';
import QUERY_KEYS from '../config/queries';
import { useRequest } from "./request";
import { AxiosError } from "axios"
import { useQuery, useQueryClient } from '@tanstack/react-query';


export const useFetchModuleData = () => {
    const request = useRequest();

    return useQuery({
        queryKey: [QUERY_KEYS.MODULE_DATA],
        queryFn: async () => {
            const { data } = await request(API.MODULE_DATA);
            return data
        },
        staleTime: 2 * 1000, // 1 minute
    });
}


export const useFetchLessonData = (lesson_uuid: string) => {
    const request = useRequest();

    const query = useQuery({
        queryKey: [QUERY_KEYS.LESSON_DATA, lesson_uuid],
        queryFn: async () => {
            const { data } = await request(API.LESSON_DATA(lesson_uuid));
            return data
        },
        staleTime: 60 * 1000, // 1 minute
    });

    console.error(query.error)

    const isForbidden = !!(
        query.error &&
        // @ts-ignore
        query.error.response?.status === 403
    )

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        isForbidden,
        error: query.error,
        refetch: query.refetch,
    }
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