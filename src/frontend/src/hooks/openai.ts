import API from '../config/api';
import QUERY_KEYS from '../config/queries';
import { useRequest } from "./request";
import { useQuery } from '@tanstack/react-query';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getHeders } from '@/utils/headers';
import { useRefreshLogin } from './user';
import { endProcBlock, setProcBlockError, updateProcBlock } from '@/store/slices/blocksSlice';
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

export async function streamChat(
    content_block_uuid: string,
    message: string,
    dispatch: AppDispatch,
    setIsStreaming: (isStreaming: boolean) => void,
    refreshLogin: () => Promise<void>,
    toastFn: (opts: any) => void
  ) {
    if (!content_block_uuid || !message) return;
    
    try {
      await refreshLogin();
    }
    catch (error: any) {
      console.error("Error refreshing login:", error);
      dispatch(setProcBlockError(error.message ?? "Stream error"));
      toastFn({
        variant: "destructive",
        title: "Ошибка!",
        description: error.message ?? "Stream error",
      });
      return;
    }

    const controller = new AbortController();
    const url = API.OPENAI_CHAT_STREAM(content_block_uuid);
    let batchContent = "";
  
    fetchEventSource(url, {
      method: "POST",
      // @ts-ignore
      headers: { ...getHeders() },
      body: JSON.stringify({ content: message }),
      signal: controller.signal,
      retry: 0,

      // @ts-ignore
      onopen(response) {
        if (response.status !== 200) {
          // если не 200, то ошибка
          const err = new Error(response.statusText);
          dispatch(setProcBlockError(response.statusText));
          toastFn({
            variant: "destructive",
            title: "Ошибка!",
            description: response.statusText,
          });
          setIsStreaming(false);
          controller.abort();
          throw err; 
        }
      },
  
      onmessage(ev) {
        let parsed;
        try {
          parsed = JSON.parse(ev.data);
        } catch {
          // если не JSON — игнорируем
          return;
        }
  
        if (parsed.error) {
          // сервер сообщил об ошибке в теле SSE
          dispatch(setProcBlockError(parsed.message));
          setIsStreaming(false);
          controller.abort();
          return 0;
        }
  
        if (parsed.done) {
          // конец стрима
          dispatch(endProcBlock());
          setIsStreaming(false);
          controller.abort();
          return 0;
        }
  
        // обычный кусок ответа
        batchContent += parsed.content.replace(/\n/g, "\n\n");
        dispatch(updateProcBlock({ content: batchContent }));
      },
  
      onerror(err) {
        // сетевые / HTTP ошибки (например, 502)
        console.error("Stream error:", err);
        dispatch(setProcBlockError(err.message ?? "Stream error"));
        toastFn({
          variant: "destructive",
          title: "Ошибка!",
          description: err.message ?? "Stream error",
        });
        setIsStreaming(false);
        controller.abort();
        throw err;
      },
    });
  }