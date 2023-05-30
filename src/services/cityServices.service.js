import { client } from "./axios.service";
export function getServices() {
  return client.get("/CityReportSystem/cityServices", {
    authorization: false,
  });
}
