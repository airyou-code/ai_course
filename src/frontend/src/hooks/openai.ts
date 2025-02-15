import API from '../config/api';
import QUERY_KEYS from '../config/queries';
import { useRequest } from "./request";
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addBlocks, updateBlockById } from '@/store/slices/blocksSlice';

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

export const useStreamChat = (content_block_uuid: string, message: string, processed_block_id: string) => {
  const dispatch = useDispatch();
  const request = useRequest();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!content_block_uuid || !message) return;

    const url = `/api/v1/content-blocks/${content_block_uuid}/stream/`;

    const fetchStream = async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }),
      });

      if (!response.ok) {
        console.error('Failed to fetch stream:', response.statusText);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader?.read() || {};
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let lineEnd;
        while ((lineEnd = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);

          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              return;
            }
            dispatch(updateBlockById({ block_id: processed_block_id, content: data }));
          }
        }
      }
    };

    fetchStream();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [content_block_uuid, message, dispatch]);

  return eventSourceRef.current;
};
