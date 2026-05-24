import axios from "./axios";

export const getAllTutorials = async () => {
  const res = await axios.get("/users/tutorials");
  return res;
};
