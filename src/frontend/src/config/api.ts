const API = {
  // users
  USER_DATA: 'http://127.0.0.1:8000/api/v1/profile/',
  USERS_UPDATE_DATA: 'http://127.0.0.1:8000/api/v1/profile/',
  USER_LOGIN: 'http://127.0.0.1:8000/api/v1/token/',
  USER_REFRESH: 'http://127.0.0.1:8000/api/v1/token/refresh/',
  CONNECTIONS: (organization: number) =>
    `/api/v1/organizations/${organization}/connections/`,
};

export default API;
