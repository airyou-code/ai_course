import API from '../config/api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../config/cookies';
import QUERY_KEYS from '../config/queries';
import { getHeders } from '../utils/headers';
import { useRequest } from './request';
import { readCookie, setCookie } from '../utils/cookie';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CSRF_TOKEN } from '../config/cookies';


export const useLogin = () => {
    const request = useRequest();
    // const refetchUser = useRefetchUser();
    // const displayResponseMessage = useDisplayResponseMessage();

    return ({ username, password }: { username: string; password: string }) => {
        return request(API.USER_LOGIN, {
            method: 'POST',
            data: {
                username: username,
                password: password,
            }
        }).then(({ data }) => {
            const { refresh, access } = data;

            setCookie(ACCESS_TOKEN, access);
            setCookie(REFRESH_TOKEN, refresh, 0.5 / 24);
            //   refetchUser();
        })
        .catch((error) => {
            let errorMessage = 'An unknown error occurred';
            if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'Invalid username or password';
            } else if (error.response.status === 404) {
                errorMessage = 'User not found';
            } else {
                errorMessage =
                error.response.data?.message || 'An unexpected error occurred';
            }
            } else {
            errorMessage = error.message || 'Network error';
            }
            console.error('Login failed:', errorMessage);
            return Promise.reject(errorMessage);
        });
    };
};


export const useRefreshLogin = () => {
    const request = useRequest();
    // const refetchUser = useRefetchUser();
    // const displayResponseMessage = useDisplayResponseMessage();
    const refreshtoken = readCookie(REFRESH_TOKEN, '')

    return () => {
        return request(API.USER_LOGIN, {
            method: 'POST',
            data: {
                refresh: refreshtoken,
            }
        }).then(({ data }) => {
            const { refresh, access } = data;
            setCookie(REFRESH_TOKEN, refresh);
            //   refetchUser();
        })
        .catch(() => {
            console.log('users.refreshtoken.error');
        });
    };
};


export const useLogout = () => {
    // const request = useRequest();
    // const refetchUser = useRefetchUser();
    // const displayResponseMessage = useDisplayResponseMessage();
  
    return async () => {
      try {
        // await request(API.USERS_LOGOUT(), {
        //   method: 'POST',
        // });
        setCookie(ACCESS_TOKEN, '');
        setCookie(REFRESH_TOKEN, '');
        // refetchUser();
      } catch (error) {
        console.error(error);
        let errorMessage = 'An unknown error occurred';
        return Promise.reject(errorMessage);
        // displayResponseMessage('users.logout.error');
      }
    };
};


export const useFetchUserData = () => {
    const request = useRequest();
    const dispatch = useContext(UserContext);;
    const displayResponseMessage = useDisplayResponseMessage();
  
    useQuery({
      queryKey: [QUERY_KEYS.USER_DATA],
      queryFn: async () => {
        try {
          const { data } = await request(API.USERS_USER());
          dispatch(setUser(data as User));
          return data as User;
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error?.response?.status === 401) {
              dispatch(setUser(null));
            } else {
              displayResponseMessage('users.fetch.error');
            }
          }
          return null;
        }
      },
    });
};
  