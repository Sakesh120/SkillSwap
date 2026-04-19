import API from "./axios";

/** Rate the other participant after a session is completed. */
export const giveRating = (payload) => API.post("/rating", payload);
