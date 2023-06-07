import { client } from "./axios.service";

export function login(accessToken) {
  return client.post(
    "/auth/login",
    JSON.stringify({
      value: accessToken,
    })
  );
}
