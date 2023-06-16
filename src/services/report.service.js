import { reportsClient, statsClient } from "./axios.service";

export function getReportTypes() {
  return reportsClient.get("/reports/types");
}
export function getApprovedReports(date, address, type, subtype) {
  console.log(btoa(type));
  return reportsClient.get(
    "/reports?" +
      (date !== undefined ? "&dateExp=" + btoa(date) : "") +
      (address !== undefined ? "&address=" + btoa(address) : "") +
      (type !== undefined ? "&type=" + btoa(type) : "") +
      (subtype !== undefined ? "&subtype=" + btoa(subtype) : "")
  );
}
export function getReports(date, address, type, subtype, approval) {
  return reportsClient.get(
    "/reports/queue?" +
      (approval !== undefined ? "approval=" + approval : "") +
      (date !== undefined ? "&dateExp=" + btoa(date) : "") +
      (address !== undefined ? "&address=" + btoa(address) : "") +
      (type !== undefined ? "&type=" + btoa(type) : "") +
      (subtype !== undefined ? "&subtype=" + btoa(subtype) : "")
  );
}
export function getStats(reports) {
  return statsClient.post("/stats", JSON.stringify(reports));
}
export function postReport(report) {
  console.log(report);
  return reportsClient.post(
    "/reports?translate=" +
      (localStorage.getItem("language") === "english" ? "true" : "false"),
    report
  );
}
export function changeApproval(id, approval) {
  return reportsClient.put("/reports/" + id + "?approval=" + approval);
}
export function deleteReport(id) {
  return reportsClient.delete("/reports/" + id);
}

export function deleteImage(id) {
  return reportsClient.delete("/reports/images/" + id);
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
    reportsClient.post("/reports/images/upload", fmData, config).then(() => {
      onSuccess("Ok");
    });
  } catch (err) {
    console.log("Error: ", err);
    onError({ err });
  }
}
