const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const API = {
  // users
  USER_REGISTRATION_REQUEST: `${BASE_URL}/email/register/request/`,
  USER_REGISTRATION: `${BASE_URL}/email/register/`,
  USER_CHANGE_PASSWORD: `${BASE_URL}/profile/password/change/`,
  USER_CHANGE_DATA: `${BASE_URL}/profile/`,
  USER_ADD_REVIEW: `${BASE_URL}/lessons/review/`,
  USER_EMAIL_CHANGE: `${BASE_URL}/email/change/`,
  USER_EMAIL_CHANGE_REQUEST: `${BASE_URL}/email/change/request/`,
  USER_DATA: `${BASE_URL}/profile/`,
  USERS_UPDATE_DATA: `${BASE_URL}/profile/`,
  USER_LOGIN: `${BASE_URL}/token/`,
  USER_REFRESH: `${BASE_URL}/token/refresh/`,
  // Courses
  MODULE_DATA: `${BASE_URL}/modules/`,
  LESSON_DATA: (lesson_uuid: string) => `${BASE_URL}/lessons/${lesson_uuid}/content-blocks/`,
  LESSON_NEXT_DATA: (lesson_uuid: string) => `${BASE_URL}/lessons/${lesson_uuid}/next-blocks/`,
  LESSON_PROGRESS: (lesson_uuid: string) => `${BASE_URL}/progress/lesson/${lesson_uuid}/`,
  LESSON_UPDATE_PROGRESS: `${BASE_URL}/progress/update/`,
  // openai_chat
  OPENAI_CHAT: (content_block_uuid: string) => `${BASE_URL}/content-blocks/${content_block_uuid}/ai-chat/messages/`,
  OPENAI_CHAT_STREAM: (content_block_uuid: string) => `${BASE_URL}/content-blocks/${content_block_uuid}/ai-chat/stream/`,
};

export default API;
