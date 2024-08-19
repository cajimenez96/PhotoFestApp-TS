import { MediafileRequest } from "../../api/mediafile"

export async function sendToBackend(downloadURL: string, width?: number, height?: number) {
  const payload = {
    EventID: "66b6ab67d728b05b6b08ab42",
    MediaURL: downloadURL,
    UserID: "66b548239d87a872c6b141ca",
    Width: width ? `${width}px` : "-",
    height: height ? `${height}px` : "-"
  }
  return await MediafileRequest(payload)
    .then((response) => {
      console.log(response.message)
    })
    .catch((error) => {
      console.log(error?.response.data)
    })
}
