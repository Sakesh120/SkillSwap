import API from "./axios";

export const getActivity = () => API.get("/activity");
