import { Paths } from "../helpers/Paths"
import Axios from "../lib/axios"

interface getEventByIdType  {
  _id: string;
  Name: string;
  Description: string;
  StartingDate: string;
  ExpiryDate: string;
  MediaUploadDeadline: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export const getEventById = async (eventId: string):Promise<getEventByIdType> => {
  const response = await Axios.get(Paths.event + "/" + eventId)
  return response.data.data
}