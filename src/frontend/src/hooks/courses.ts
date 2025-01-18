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