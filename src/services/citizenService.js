import { client, BASE_URL } from "./axios.service";
import axios from "axios";
export function login(username, password) {
  const credentials = btoa(username + ":" + password);
  return axios.get(BASE_URL + "/CityReportSystem/login", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + credentials,
    },
  });
}

export function createCitizen(citizen) {
  console.log(citizen);
  const c = {
    firstName: citizen.firstName,
    lastName: citizen.lastName,
    phone: citizen.phone,
    idCard: citizen.idCard,
    password: citizen.passwordHash,
  };
  return client.post("/CityReportSystem/signup", c);
}
