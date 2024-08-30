import { Paths } from "../helpers/Paths";
import Axios from "../lib/axios"

type payloadType = {
  EventID: string;
  MediaURL: string;
  UserID: string;
  Width: string;
  height: string;
  MediaTypeID: string;
}

type MediafileRequestType = {
  EventID: string;
  MediaURL: string;
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