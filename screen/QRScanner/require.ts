import { IPayloadUserEventAssociation, UserEventAssociationApi } from "../../api/eventUserAssociation";
import { emailExistError, EVENT_ID, serverError, TOKEN, USER_ID } from "../../common/constants";
import { setAsyncStorage } from "../../helpers/helper";

export const eventUserAssociation = async (
  data: IPayloadUserEventAssociation,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setUserLogued: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { EventID } = data
  setError("")
  setLoading(true)

  await UserEventAssociationApi(data)
    .then((response) => {
      setAsyncStorage(TOKEN, response.data.token);
      setAsyncStorage(USER_ID, response.data.user._id);
      setAsyncStorage(EVENT_ID, EventID)
      setUserLogued(true)
      setOpenModal(false)

      return ({ status: 200, message: "Usuario logueado" })
    })
    .catch((error) => {
      setLoading(false)
      const errorStatus = error.response?.status
      if (errorStatus === 409) {
        setError(emailExistError)
      } else {
        setError(serverError)
      }
    })
    .finally(() => {
      setLoading(false)
    })
}


