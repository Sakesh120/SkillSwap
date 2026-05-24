import axios from "./axios";

export const getAllTutorials = async () => {
  const res = await axios.get("/users/tutorials");
  return res;
};

export const getUserTutorials = async () => {
  const res = await axios.get("/users/tutorials/me");
  return res;
};
