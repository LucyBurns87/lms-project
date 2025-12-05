import API from "./axios";

export async function login(username, password) {
  const response = await API.post("/token/", { username, password });
  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);
  return response.data;
}

export async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  const response = await API.post("/token/refresh/", { refresh });
  localStorage.setItem("access", response.data.access);
  return response.data.access;
}

export async function getUser() {
  const response = await API.get("/users/profile/");
  return response.data;
}

export async function register(userData) {
  const response = await API.post("/users/register/", userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("token");
}

export async function getProfile() {
  const response = await API.get("/users/profile/");
  return response.data;
}

export async function updateProfile(profileData) {
  const response = await API.patch("/users/profile/", profileData);
  return response.data;
}