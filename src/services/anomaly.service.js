import { detectionClient } from "./axios.service";

export function detect(accessToken) {
  return detectionClient.get("/anomaly_detection");
}
