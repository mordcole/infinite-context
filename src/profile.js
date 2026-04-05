function getProfile() {
  try {
    const stored = localStorage.getItem("ic_profile");
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return {
    name: "Mordecai",
    github_username: "mordcole",
    role: "Software engineering student",
    focus: "RAG and embeddings",
  };
}

const profile = getProfile();
export default profile;
