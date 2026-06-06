import API from "./axios";

export const getChatHistory = (sessionId) => API.get(`/chat/${sessionId}`);
export const getSessionById = (sessionId) => API.get(`/session/${sessionId}`);
export const postChatMessage = (sessionId, content) =>
  API.post(`/chat/${sessionId}`, { content });
