import { client } from "./axios.service";
// export function getStats(type, start, end) {
//   return axios.get(
//     "/CityReportSystem/statistics/" + start + "/" + end + "/" + type,
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }
export function getStats(type, start, end) {
  return client.get(
    "/CityReportSystem/statistics/" + start + "/" + end + "/" + type,

    { authorization: true }
  );
}
// export function getYearStats(year) {
//   console.log(year);
//   return axios.get("/CityReportSystem/statistics/" + year, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }
export function getYearStats(year) {
  return client.get("/CityReportSystem/statistics/" + year);
}
