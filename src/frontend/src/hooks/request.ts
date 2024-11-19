import axios, { AxiosError } from 'axios';
import { getHeders } from '../utils/headers';

export const useRequest = () => {
  return async (
    url: string,
    {
      data = {},
      method = 'get',
      headers = {},
      params = {},
    }: {
      data?: any;
      method?: string;
      headers?: any;
      params?: any;
    } = {},
  ) => {
    return axios({
      headers: {
        ...headers,
        ...getHeders()
      },
      url,
      data,
      params,
      method,
    }).catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        console.log(error?.response?.status)
      }
      throw error;
    });
  };
};