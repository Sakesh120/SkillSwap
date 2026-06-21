import API from "./axios";

export const getSessions = () => API.get("/session");
export const scheduleSession = (sessionId, scheduledAt) =>
  API.post("/session/schedule", { sessionId, scheduledAt });
export const updateSessionPlatform = (sessionId, platform) =>
  API.post("/session/platform", { sessionId, platform });
export const createSessionRoom = (sessionId) =>
  API.post("/session/create-room", { sessionId });
export const getSessionByRoomId = (roomId) =>
  API.get(`/session/room/${roomId}`);
export const completeSession = (sessionId) =>
  API.post("/session/complete", { sessionId });
