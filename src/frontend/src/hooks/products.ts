import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequest } from './request';


export const useFetchProductData = () => {
    const request = useRequest();
  
    return useQuery(
    {
      queryKey: ['PRODUCT'],
      queryFn: async () => {
          const { data } = await request("https://3f7d6e58b5bc239a.mokky.dev/products");
          return data;
      }
    });
};
