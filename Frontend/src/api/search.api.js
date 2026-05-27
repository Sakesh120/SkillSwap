import axios from "./axios";

export const searchTutorials = async (query) => {
  try {
    const res = await axios.get("/users/tutorials");
    const allTutorials = res.data || [];

    // Filter tutorials by skillCategory or caption matching the query
    const filtered = allTutorials.filter((tutorial) => {
      const matchesSkillCategory = tutorial.skillCategory
        ?.toLowerCase()
        .includes(query.toLowerCase());
      const matchesCaption = tutorial.caption
        ?.toLowerCase()
        .includes(query.toLowerCase());
      const matchesUserName = tutorial.userName
        ?.toLowerCase()
        .includes(query.toLowerCase());

      return matchesSkillCategory || matchesCaption || matchesUserName;
    });

    return { data: filtered };
  } catch (error) {
    console.error("Failed to search tutorials:", error);
    return { data: [] };
  }
};

export const searchUsers = async (query) => {
  try {
    const res = await axios.get(`/users/search?q=${encodeURIComponent(query)}`);
    return { data: res.data.data || [] };
  } catch (error) {
    console.error("Failed to search users:", error);
    return { data: [] };
  }
};
