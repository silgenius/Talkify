export const setUser = (user: object) => {
  return localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};
