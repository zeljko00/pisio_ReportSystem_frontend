import { createAxiosClient } from "./request.interceptor";
// export const BASE_URL = "http://localhost:8080";
export const BASE_URL = "http://192.168.100.8:8080";
function getToken() {
  try {
    const token = JSON.parse(sessionStorage.getItem("user")).token;
    console.log(token);
    return token;
  } catch (ex) {
    console.log("no token");
    return "NO_TOKEN";
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
