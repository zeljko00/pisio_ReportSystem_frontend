import { client } from "./axios.service";

// export function getReportTypes() {
//   return axios.get("/CityReportSystem/reports/types", {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }
// export function getReportStates() {
//   return axios.get("/CityReportSystem/reports/states", {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }
// export function getReportTypesByDepartment(id) {
//   return axios.get("/CityReportSystem/reports/types/" + id, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }
// export function getReports(
//   user,
//   department,
//   page,
//   size,
//   type,
//   state,
//   search,
//   sort,
//   dir
// ) {
//   return axios.get(
//     "/CityReportSystem/reports/" +
//       user +
//       "/" +
//       department +
//       "/" +
//       type +
//       "/" +
//       state +
//       "/" +
//       page +
//       "/" +
//       size +
//       "/" +
//       search +
//       "/" +
//       sort +
//       "/" +
//       dir,
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }

// export function postReport(report) {
//   return axios.post("/CityReportSystem/reports", report, {
//     headers: { "Content-Type": "application/json" },
//   });
// }
// export function provideInfo(report, info) {
//   return axios.put("/CityReportSystem/reports/additionalInfo/" + report, info, {
//     headers: { "Content-Type": "application/json" },
//   });
// }
// export function requireInfo(report, info) {
//   return axios.put("/CityReportSystem/reports/requireInfo/" + report, info, {
//     headers: { "Content-Type": "application/json" },
//   });
// }
// export function changeState(user, id, state) {
//   return axios.put(
//     "/CityReportSystem/reports/state/" + user + "/" + id,
//     state,
//     {
//       headers: { "Content-Type": "application/json" },
//     }
//   );
// }
// export function addFeedback(report, feedback) {
//   return axios.put("/CityReportSystem/reports/feedback/" + report, feedback, {
//     headers: { "Content-Type": "application/json" },
//   });
// }

// export function getMyReports(id) {
//   return axios.get("/CityReportSystem/reports/author/" + id, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

// export function deleteImage(id) {
//   return axios.delete("/CityReportSystem/reports/images/" + id, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }
// export function uploadImage(image, id) {
//   const { onSuccess, onError, file, onProgress } = image;
//   console.log("uploading");
//   console.log(file);
//   const fmData = new FormData();
//   const config = {
//     headers: { "content-type": "multipart/form-data" },
//     onUploadProgress: (event) => {
//       onProgress({ percent: (event.loaded / event.total) * 100 });
//     },
//   };
//   fmData.append("image", file);
//   fmData.append("identificator", id + "--" + file.name);
//   try {
//     axios
//       .post("/CityReportSystem/reports/images/upload", fmData, config)
//       .then(() => {
//         onSuccess("Ok");
//       });
//   } catch (err) {
//     console.log("Error: ", err);
//     onError({ err });
//   }
// }
export function getReportTypes() {
  return client.get("/CityReportSystem/reports/types", {
    authorization: false,
  });
}
export function getReportStates() {
  return client.get("/CityReportSystem/reports/states", {
    authorization: false,
  });
}
export function getReportTypesByDepartment(id) {
  return client.get("/CityReportSystem/reports/types/" + id);
}
export function getReports(
  user,
  department,
  page,
  size,
  type,
  state,
  search,
  sort,
  dir
) {
  return client.get(
    "/CityReportSystem/reports/" +
      user +
      "/" +
      department +
      "/" +
      type +
      "/" +
      state +
      "/" +
      page +
      "/" +
      size +
      "/" +
      search +
      "/" +
      sort +
      "/" +
      dir
  );
}

export function postReport(report) {
  return client.post("/CityReportSystem/reports", report);
}
export function provideInfo(report, info) {
  return client.put("/CityReportSystem/reports/additionalInfo/" + report, info);
}
export function requireInfo(report, info) {
  return client.put("/CityReportSystem/reports/requireInfo/" + report, info);
}
export function changeState(user, id, state) {
  return client.put(
    "/CityReportSystem/reports/state/" + user + "/" + id,
    state
  );
}
export function addFeedback(report, feedback) {
  return client.put("/CityReportSystem/reports/feedback/" + report, feedback);
}

export function getMyReports(id) {
  return client.get("/CityReportSystem/reports/author/" + id);
}

export function deleteImage(id) {
  return client.delete("/CityReportSystem/reports/images/" + id);
}
export function uploadImage(image, id) {
  const { onSuccess, onError, file, onProgress } = image;
  console.log("uploading");
  console.log(file);
  const fmData = new FormData();
  const config = {
    headers: { "content-type": "multipart/form-data" },
    onUploadProgress: (event) => {
      onProgress({ percent: (event.loaded / event.total) * 100 });
    },
  };
  fmData.append("image", file);
  fmData.append("identificator", id + "--" + file.name);
  try {
    client
      .post("/CityReportSystem/reports/images/upload", fmData, config)
      .then(() => {
        onSuccess("Ok");
      });
  } catch (err) {
    console.log("Error: ", err);
    onError({ err });
  }
}
