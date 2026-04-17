import API from "./axios";

export const getReceivedRequests = () => API.get("/request/received");
export const respondRequest = (id, status) =>
  API.put(`/request/${id}/respond`, { status });
export const deleteRequest = (id) => API.delete(`/request/delete/${id}`);
