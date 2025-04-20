import API from '../config/api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../config/cookies';
import QUERY_KEYS from '../config/queries';
import { getHeders } from '../utils/headers';
import { useRequest, useAuthRequest } from './request';
import { readCookie, setCookie } from '../utils/cookie';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CSRF_TOKEN } from '../config/cookies';
import { parseDRFErrors } from '@/utils/error';

import { useContext } from 'react';
import { AxiosError } from 'axios';
import { UserContext, setUser } from '../reducers/user';

declare type User = {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
};

export const useRefetchUser = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_DATA] });
  };
};

export const useLogin = () => {
    const request = useAuthRequest();
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
            setCookie(REFRESH_TOKEN, refresh, 29);
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
                errorMessage = 'An unexpected error occurred';
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
    const request = useAuthRequest();
    const refetchUser = useRefetchUser();
    const refreshtoken = readCookie(REFRESH_TOKEN, '')

    return () => {
        return request(API.USER_REFRESH, {
            method: 'POST',
            data: {
                refresh: refreshtoken,
            }
        }).then(({ data }) => {
            const { access } = data;
            setCookie(ACCESS_TOKEN, access);
            refetchUser();
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

export const useUserState = () => {
  const { state } = useContext(UserContext);
  return state;
};

export const useUserDispatch = () => {
  const { dispatch } = useContext(UserContext);
  return dispatch;
};

export const useUser = () => {
  return useUserState().user as User;
};

export const useLogout = () => {
  // const request = useRequest();
  const refetchUser = useRefetchUser();
  const dispatch = useUserDispatch();

  return async () => {
    try {
      setCookie(ACCESS_TOKEN, '');
      setCookie(REFRESH_TOKEN, '');
      dispatch(setUser(null));
      refetchUser();
    } catch (error) {
      console.error(error);
      let errorMessage = 'An unknown error occurred';
      return Promise.reject(errorMessage);
    }
  };
};

export const useFetchUserData = () => {
  const request = useRequest();
  const dispatch = useUserDispatch();

  const { refetch } = useQuery({
    queryKey: [QUERY_KEYS.USER_DATA],
    queryFn: async () => {
      try {
        const { data } = await request(API.USER_DATA);
        if (data) {
          dispatch(setUser(data as User));
        }
        return data as User;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error?.response?.status === 401) {
            dispatch(setUser(null));
          } else {
            console.error('Fetch User Data Failed:', error);
          }
        }
        return null;
      }
    },
    // enabled: false,
  });

  return refetch;
};

export const useSaveUserData = () => {
  const request = useRequest();
  const refetchUser = useRefetchUser();

  return async (data: { [key: string]: string }) => {
    try {
      await request(API.USERS_UPDATE_DATA, {
        method: 'PATCH',
        data,
      });
      refetchUser();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};


export const useRegisterRequest = () => {
  const request = useAuthRequest();

  return (email: string) => {
    return request(API.USER_REGISTRATION_REQUEST, {
        method: 'POST',
        data: {
          email: email,
        },  
        headers: {
          "Accept-Language": "ru-RU",
        },
    }).then(() => {
        return null
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
};


interface EmailRegister {
  email: string, code: string,
  username: string,
  password: string,
  first_name: string,
  last_name: string
}

export const useRegister = () => {
  const request = useAuthRequest();

  return ({email, username, code, password, first_name, last_name}:EmailRegister) => {
    return request(API.USER_REGISTRATION, {
        method: 'POST',
        data: {
          email: email,
          username: username,
          code_candidate: code,
          password: password,
          first_name: first_name,
          last_name: last_name,
        },
        headers: {
          "Accept-Language": "ru-RU",
        },
    }).then(({ data }) => {
      const { refresh, access } = data;

      setCookie(ACCESS_TOKEN, access);
      setCookie(REFRESH_TOKEN, refresh, 29);
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


interface ChangePassword {
  old_password: string,
  new_password: string,
}

export const useChangePassword = () => {
  const request = useRequest();

  return ({old_password, new_password}:ChangePassword) => {
    return request(API.USER_CHANGE_PASSWORD, {
        method: 'PATCH',
        data: {
          old_password: old_password,
          new_password: new_password,
        },
        headers: {
          "Accept-Language": "ru-RU",
        },
    }).then(() => {
      return null
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


interface ChangeUserData {
  username: string,
  first_name: string,
  last_name: string,
}


export const useChangeUserData = () => {
  const request = useRequest();

  return ({username, first_name, last_name}:ChangeUserData) => {
    return request(API.USER_CHANGE_DATA, {
        method: 'PATCH',
        data: {
          username: username,
          first_name: first_name,
          last_name: last_name,
        },
        headers: {
          "Accept-Language": "ru-RU",
        },
    }).then(() => {
      return null
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


export const useEmailChangeRequest = () => {
  const request = useRequest();

  return (email: string) => {
    return request(API.USER_EMAIL_CHANGE_REQUEST, {
        method: 'POST',
        data: {
          email: email,
        },  
        headers: {
          "Accept-Language": "ru-RU",
        },
    }).then(() => {
        return null
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
};


interface EmailChange {
  code: string,
}

export const useEmailChange = () => {
  const request = useRequest();

  return ({code}:EmailChange) => {
    return request(API.USER_EMAIL_CHANGE, {
        method: 'POST',
        data: {
          code_candidate: code,
        },
        headers: {
          "Accept-Language": "ru-RU",
        },
    }).then(({ data }) => {
      const { refresh, access } = data;

      setCookie(ACCESS_TOKEN, access);
      setCookie(REFRESH_TOKEN, refresh, 29);
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