import API from '../config/api';
import QUERY_KEYS from '../config/queries';
import { useRequest } from "./request";
import { useQuery } from '@tanstack/react-query';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getHeders } from '@/utils/headers';
import { useRefreshLogin } from './user';
import { endProcBlock, updateProcBlock } from '@/store/slices/blocksSlice';
import { AppDispatch } from '@/store';

export const useFetchChatHistory = (content_block_uuid: string) => {
    const request = useRequest();
    return useQuery({
      queryKey: ["CHAT", content_block_uuid],
      queryFn: async () => {
        const { data } = await request(API.OPENAI_CHAT(content_block_uuid));
        return data;
      },
      staleTime: 60 * 1000, // 1 minute
      enabled: Boolean(content_block_uuid), // если uuid отсутствует, запрос не будет запущен
    });
  };

export async function streamChat(content_block_uuid: string, message: string, dispatch: AppDispatch, refreshLogin: () => Promise<void>) {
    if (!content_block_uuid || !message) return;

    await refreshLogin();
  
    const controller = new AbortController();
    const url = API.OPENAI_CHAT_STREAM(content_block_uuid);

    let batchContent = "";
    let chunkCounter = 0;
  
    fetchEventSource(url, {
      method: 'POST',
      // @ts-ignore
      headers: { ...getHeders() },
      body: JSON.stringify({ content: message }),
      signal: controller.signal,
  
      onmessage(ev) {
        if (ev.data === '[DONE]') {
            console.log('Stream done');
            dispatch(endProcBlock());
            controller.abort();
            return;
        }
        if (ev.data.startsWith('[ERROR]')) {
            console.error('Backend error:', ev.data);
            dispatch(endProcBlock());
            controller.abort();
            return;
        }
        batchContent += ev.data.replace(/\\n/g, '\n\n');
        chunkCounter++;

        if (chunkCounter >= 5) {
            dispatch(updateProcBlock({ content: batchContent }));
            chunkCounter = 0;
        }
      },
  
      onerror(err) {
        console.error('Stream error:', err);
        dispatch(endProcBlock());
        controller.abort();
      },
    });
  }