import AsyncStorage from "@react-native-async-storage/async-storage";
import { IPayloadLogin, loginApi } from "../../api/login"
import { setToken } from "../../helpers/helper";

export const login = async (data: IPayloadLogin) => {  
  return await loginApi(data)
  .then( async (response) => {

    if (!response.token) throw new Error("Usuario no se pudo loguear");
    
    setToken(response.token);
    return ({status: 200, message: "Usuario logueado"})
  })
  .catch((err) => ({status: 500, message: err}));
}
