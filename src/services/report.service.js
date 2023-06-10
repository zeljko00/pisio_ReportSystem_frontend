import { client } from "./axios.service";

export function getReportTypes() {
  return client.get("/reports/types");
}
export function getApprovedReports(date, address, type, subtype) {
  return client.get(
    "/reports?" +
      (date !== undefined ? "&dateExp=" + date : "") +
      (address !== undefined ? "&address=" + address : "") +
      (type !== undefined ? "&type=" + type : "") +
      (subtype !== undefined ? "&subtype=" + subtype : "")
  );
}
export function getReports(date, address, type, subtype, approval) {
  return client.get(
    "/reports/queue?" +
      (approval !== undefined ? "approval=" + approval : "") +
      (date !== undefined ? "&dateExp=" + date : "") +
      (address !== undefined ? "&address=" + address : "") +
      (type !== undefined ? "&type=" + type : "") +
      (subtype !== undefined ? "&subtype=" + subtype : "")
  );
}
export function getStats(reports) {
  return client.post("/stats", JSON.stringify(reports));
}
export function postReport(report) {
  return client.post("/reports", report);
}
export function changeApproval(id, approval) {
  return client.put("/reports/" + id + "?approval=" + approval);
}
export function deleteReport(id) {
  return client.delete("/reports/" + id);
}

export function deleteImage(id) {
  return client.delete("/reports/images/" + id);
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
    client.post("/reports/images/upload", fmData, config).then(() => {
      onSuccess("Ok");
    });
  } catch (err) {
    console.log("Error: ", err);
    onError({ err });
  }
}
