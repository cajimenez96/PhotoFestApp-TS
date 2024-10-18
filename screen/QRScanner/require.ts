import { IPayloadUserEventAssociation, UserEventAssociationApi } from "../../api/eventUserAssociation";
import { EVENT_ID, TOKEN, USER_ID } from "../../common/constants";
import { setAsyncStorage } from "../../helpers/helper";

export const eventUserAssociation = async (
  data: IPayloadUserEventAssociation,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setUserLogued: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { EventID } = data
  try {
    setError("")
    setLoading(true)
    
    const response = await UserEventAssociationApi(data)

    if (!response.data.token) setError("Usuario no se pudo loguear");

    setAsyncStorage(TOKEN, response.data.token);
    setAsyncStorage(USER_ID, response.data.user._id);
    setAsyncStorage(EVENT_ID, EventID)
    setUserLogued(true)
    setOpenModal(false)

    return ({ status: 200, message: "Usuario logueado" })
  } catch (error) {
    setLoading(false)
    setError("El email ingresado ya esta registrado")
  } finally {
    setLoading(false)
  }
}
