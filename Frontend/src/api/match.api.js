import API from "./axios";

export const getMatches = () => API.get("/match");
export const sendSwapRequest = (payload) => API.post("/request/send", payload);
