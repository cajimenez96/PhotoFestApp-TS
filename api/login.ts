import { Paths } from "../helpers/Paths"
import Axios from "../lib/axios";

export interface IPayloadLogin {
  UserName: string;
  Password: string;
  eventID: string;
  email: string;
}

export const loginApi = async (payload: IPayloadLogin): Promise<any> => {
  const response = await Axios.post(Paths.auth+"/login", payload)
  return response.data
}