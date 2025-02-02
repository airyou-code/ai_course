const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const API = {
  // users
  USER_DATA: `${BASE_URL}/profile/`,
  USERS_UPDATE_DATA: `${BASE_URL}/profile/`,
  USER_LOGIN: `${BASE_URL}/token/`,
  USER_REFRESH: `${BASE_URL}/token/refresh/`,
  // Courses
  MODULE_DATA: `${BASE_URL}/modules/`,
  LESSON_DATA: (lesson_uuid: string) => `${BASE_URL}/lessons/${lesson_uuid}/content-blocks/`,
};

export default API;
