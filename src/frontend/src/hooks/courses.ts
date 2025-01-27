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
            console.log(data)
            return data
        }
    });
}


export const useFetchLessonData = () => {
    const request = useRequest();

    return useQuery({
        queryKey: [QUERY_KEYS.LESSON_DATA],
        queryFn: async () => {
            const { data } = await request(API.LESSON_DATA("2ee779c4-6bef-46da-a587-a2def1cb25c6"));
            console.log(data)
            return data
        }
    });
}
