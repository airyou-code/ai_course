import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequest } from './request';


export const useFetchPersonsData = () => {
    const request = useRequest();
  
    return useQuery(
    {
      queryKey: ['PERSON'],
      queryFn: async () => {
          const { data } = await request("https://3f7d6e58b5bc239a.mokky.dev/users");
          return data;
      }
    });
};


export const useCreatePerson = () => {
    const request = useRequest();
    const queryClient = useQueryClient()

    return useMutation(
    {
      mutationFn: async (data: any) => {
        return await request(
            "https://3f7d6e58b5bc239a.mokky.dev/users",
            {
                data: data,
                method: "post"
            }
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['PERSON'] })
      },
    });
};


export const useDeletePerson = () => {
    const request = useRequest();
    const queryClient = useQueryClient()
  
    return useMutation(
    {
      mutationFn: async (id: number) => {
        return await request(
            `https://3f7d6e58b5bc239a.mokky.dev/users/${id}`,
            {
                method: "delete"
            }
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['PERSON'] })
      },
    });
};