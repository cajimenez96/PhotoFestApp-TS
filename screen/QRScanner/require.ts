import { IPayloadLogin, loginApi } from "../../api/login"
import { EVENT_ID, TOKEN, USER_ID } from "../../common/constants";
import { setAsyncStorage } from "../../helpers/helper";

export const login = async (data: IPayloadLogin) => {  
  const {eventID} = data
  return await loginApi(data)
  .then( async (response) => {

    if (!response.token) throw new Error("Usuario no se pudo loguear");
    setAsyncStorage(TOKEN, response.token);
    setAsyncStorage(USER_ID, response.user.id);
    setAsyncStorage(EVENT_ID, eventID)

    return ({status: 200, message: "Usuario logueado"})
  })
  .catch((err) => ({status: 500, message: err}));
}
