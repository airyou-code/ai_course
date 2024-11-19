import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readCookie, setCookie } from '../utils/cookie';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../config/cookies';
import { getHeders } from '../utils/headers';
import { CSRF_TOKEN } from '../config/cookies';
import { useRequest } from './request';


export const useFetchTasksData = ({ page, page_size }: { page: number; page_size: number }) => {
    const request = useRequest();
    const accesstoken = readCookie(ACCESS_TOKEN, '')

  
    return useQuery(
    {
      queryKey: ['tasks', page, page_size],
      queryFn: async () => {
        const { data } = await request(
            "http://127.0.0.1:8000/api/v1/tasks/task/",
            {
                params: {
                    page: page,
                    page_size: page_size
                },
                headers: getHeders()
            }
        );
        return data;
      }
    });
};