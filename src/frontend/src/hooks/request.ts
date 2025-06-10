import axios, { AxiosError } from 'axios';
import { getHeders, getFreeHeders } from '../utils/headers';
import { useRefreshLogin } from './user';
import { readCookie } from '../utils/cookie';
import { REFRESH_TOKEN } from '../config/cookies';
import { useError } from '@/app/WithErrorProvider';
import { useToast } from "@/hooks/use-toast"
import { useUserLanguage } from './user';
import { useTranslation } from 'react-i18next';

export const useAuthRequest = () => {
  const { toast } = useToast()
  const language = useUserLanguage();
  const { t } = useTranslation();

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
        ...getFreeHeders(),
        'Accept-Language': language,
      },
      url,
      data,
      params,
      method,
    }).catch((error: any) => {
      if (error?.response?.status >= 500) {
        toast({
          variant: "destructive",
          title: t("common.errorTitle"),
          description: error?.response?.data?.message || error.message,
        })
      }
      throw error;
    });
  };
};

export const useRequest = () => {
  const refreshLogin = useRefreshLogin();
  const { toast } = useToast()
  const language = useUserLanguage();
  const { t } = useTranslation();
  let isRefreshing = false;

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
    try {
      return await axios({
        headers: {
          ...headers,
          ...getHeders(),
          'Accept-Language': language,
        },
        url,
        data,
        params,
        method,
      });
    } catch (error: any) {
      if (error?.response?.status === 401 && !isRefreshing) {
        const refreshtoken = readCookie(REFRESH_TOKEN, '');
        if (!refreshtoken) {
          throw new Error('Refresh token is missing');
        }

        isRefreshing = true;
        try {
          await refreshLogin();
          return await axios({
            headers: {
              ...headers,
              ...getHeders()
            },
            url,
            data,
            params,
            method,
          });
        } catch (refreshError: any) {
          toast({
            variant: "destructive",
            title: t("common.errorTitle"),
            description: error?.response?.data?.message || error.message,
          })
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }
      // toast({
      //   variant: "destructive",
      //   title: "Ошибка!",
      //   description: error?.response?.data?.message || error.message,
      // })
      throw error;
    }
  };
};