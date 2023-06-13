import { client } from "./axios.service";

export function detect(accessToken) {
  return client.get("/anomaly_detection");
}
