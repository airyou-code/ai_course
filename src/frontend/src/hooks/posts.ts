import { useRequest } from "./request";
import { useQuery, useQueryClient } from '@tanstack/react-query';


export const useFetchPostData = () => {
    const request = useRequest();
    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: async () => {
            const { data } = await request("https://jsonplaceholder.typicode.com/posts")
            console.log(data)
            return data
        }
    });
}