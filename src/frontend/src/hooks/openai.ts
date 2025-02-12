import API from '../config/api';
import QUERY_KEYS from '../config/queries';
import { useRequest } from "./request";
import { useQuery } from '@tanstack/react-query';


export const useFetchChatHistory = (content_block_uuid: string) => {
    const request = useRequest();

    if (!content_block_uuid) {
        return { data: [] };
    }

    return useQuery({
        queryKey: ["CHAT", content_block_uuid],
        queryFn: async () => {
            const { data } = await request(API.OPENAI_CHAT(content_block_uuid));
            return data
        },
        staleTime: 60 * 1000, // 1 minute
    });
}
