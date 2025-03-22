import { Paths } from "../helpers/Paths";
import Axios from "../lib/axios"

type payloadType = {
  mediaFileData: {
    EventID: string;
    blobBase64: string;
    UserID: string;
    Width: string;
    height: string;
    MediaTypeID: string;
  }
}

type MediafileRequestType = {
  EventID: string;
  blobBase64: string;
  UserID: string;
  Width: string;
  MediaTypeID: string;
  _id: string;
  createdAt: string;
  height: string;
  updatedAt: string;
  message: string;
}

export const MediafileRequest = async (payload: payloadType): Promise<MediafileRequestType> => {
  const response = await Axios.post<MediafileRequestType>(Paths.mediafile, payload)
  return response.data
}

export const mediaFileTypes = async () => {
  const response = await Axios.get(Paths.mediaFileType)
  return response.data
}

export const getMediaFiles = async (eventId: string, page: number) => {
  const response = await Axios.get(Paths.mediafile, {
    params: { EventID: eventId, page: page, IsPublished: true, IsSafeContent: true }
  })

  return response
}