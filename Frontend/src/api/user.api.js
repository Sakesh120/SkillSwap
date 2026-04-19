import axios from "./axios";

export const getProfile = async () => {
  const res = await axios.get("/users/profile");
  return res;
};

export const getUserById = async (id) => {
  const res = await axios.get(`/users/${id}/profile`);
  return res;
};

export const updateProfile = async (data, avatarFile) => {
  const formData = new FormData();
  formData.append("name", data.name || "");
  formData.append("skillsOffered", JSON.stringify(data.skillsOffered || []));
  formData.append("skillsWanted", JSON.stringify(data.skillsWanted || []));
  formData.append("about", data.about || "");
  formData.append("tagline", data.tagline || "");
  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }
  const res = await axios.put("/users/Update-profile", formData);
  return res;
};
