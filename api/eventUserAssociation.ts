import { Paths } from "../helpers/Paths"
import Axios from "../lib/axios";

export interface IPayloadUserEventAssociation {
  EventID: string;
  UserName: string;
  Name: string;
  LastName: string;
}

export const UserEventAssociationApi = async (payload: IPayloadUserEventAssociation): Promise<any> => {
  const response = await Axios.post(Paths.eventUserAssociation, payload)
  return response.data
}