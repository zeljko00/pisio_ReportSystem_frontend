import { createAxiosClient } from "./request.interceptor";
export const BASE_URL = "http://localhost:8080/report_system";
// export const BASE_URL = "http://192.168.100.8:8080/report_system";

function getToken() {
  try {
    const token = JSON.parse(sessionStorage.getItem("user")).jwt;
    return token;
  } catch (ex) {
    console.log("no token");
  }
}
export const client = createAxiosClient({
  options: {
    baseURL: BASE_URL,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
    },
  },
  getToken,
});
