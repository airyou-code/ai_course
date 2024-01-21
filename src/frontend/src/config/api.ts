const API = {
  // users
  USER_DATA: '/api/v1/users/user/',
  USER_LOGIN: '/api/v1/users/authenticate/',
  USER_LOGOUT: '/api/v1/users/logout/',
  // organizations
  OPTIONS: '/api/v1/organizations/options/',
  CONNECTIONS: (organization: number) =>
    `/api/v1/organizations/${organization}/connections/`,
};

export default API;
