import API from "./axios";

export const getSessions = () => API.get("/session");
export const scheduleSession = (sessionId, scheduledAt) =>
  API.post("/session/schedule", { sessionId, scheduledAt });
export const completeSession = (sessionId) =>
  API.post("/session/complete", { sessionId });
