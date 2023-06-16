import { authClient } from "./axios.service";

export function login(accessToken) {
  return authClient.post(
    "/auth/login",
    JSON.stringify({
      value: accessToken,
    })
  );
}
