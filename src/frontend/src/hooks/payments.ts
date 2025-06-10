import API from '../config/api';
import QUERY_KEYS from '../config/queries';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRequest } from "./request";
import { parseDRFErrors } from '@/utils/error';


export const useFetchPaymentsParams = () => {
    const request = useRequest();

    return () => {
        return request(API.PAYMENTS_PARAMS, {
            method: 'GET',
        }).then(({data}) => {
          return data;
        })
        .catch((error) => {
          if (!error.response) {
            return Promise.reject({
              status: null,
              fieldErrors: {},
              nonFieldErrors: ['Network error or server not responding'],
            });
          }
      
          const { status, data } = error.response;
          // Внутренняя ошибка сервера
          if (status >= 500) {
            return Promise.reject({
              status,
              fieldErrors: {},
              nonFieldErrors: ['There was an internal server error'],
            });
          }
      
          // Парсим ошибки DRF
          const { fieldErrors, nonFieldErrors } = parseDRFErrors(data);
          return Promise.reject({ status, fieldErrors, nonFieldErrors });
        });
    };
}

export const useFetchProductData = () => {
    const request = useRequest();

    return useQuery({
        queryKey: [QUERY_KEYS.PRODUCT_DATA],
        queryFn: async () => {
            const { data } = await request(API.PRODUCT_DATA);
            return data
        },
        staleTime: 2 * 1000, // 1 minute
    });
}