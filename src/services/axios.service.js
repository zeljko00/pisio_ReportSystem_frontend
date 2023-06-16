import { createAxiosClient } from "./request.interceptor";
export const AUTH_BASE_URL = process.env.REACT_APP_AUTH_BASE_URL;
export const REPORT_BASE_URL = process.env.REACT_APP_REPORT_BASE_URL;
export const STATS_BASE_URL = process.env.REACT_APP_STATS_BASE_URL;
export const DETECTION_BASE_URL = process.env.REACT_APP_DETECTION_BASE_URL;

function getToken() {
  console.log(AUTH_BASE_URL);
  try {
    const token = JSON.parse(sessionStorage.getItem("user")).jwt;
    return token;
  } catch (ex) {
    console.log("no token");
  }
}
export const authClient = createAxiosClient({
  options: {
    baseURL: AUTH_BASE_URL,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
    },
  },
  getToken,
});
export const reportsClient = createAxiosClient({
  options: {
    baseURL: REPORT_BASE_URL,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
    },
  },
  getToken,
});
export const statsClient = createAxiosClient({
  options: {
    baseURL: STATS_BASE_URL,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
    },
  },
  getToken,
});
export const detectionClient = createAxiosClient({
  options: {
    baseURL: DETECTION_BASE_URL,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
    },
  },
  getToken,
});
