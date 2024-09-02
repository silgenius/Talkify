import { UserType } from "../types";

export const setUser = (user: UserType) => {
  return localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getUser = (): UserType => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  return localStorage.removeItem("currentUser");
};
