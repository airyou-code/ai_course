import axios, { AxiosError } from 'axios';
import { getHeders } from '../utils/headers';
import { setCookie } from '../utils/cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config/cookies';

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
        setCookie(ACCESS_TOKEN, '');
        setCookie(REFRESH_TOKEN, '');
      }
      throw error;
    });
  };
};