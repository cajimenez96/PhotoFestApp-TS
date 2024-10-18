import { MediafileRequest } from "../../api/mediafile"
import { Alert } from "react-native"
import { getAsyncStorage, setAsyncStorage } from "../../helpers/helper";
import { EVENT_ID, USER_ID, TOKEN } from "../../common/constants";

export async function sendToBackend(downloadURL: string, width: number, height: number, mediaTypeId: string) {
  const userId = await getAsyncStorage(USER_ID) ?? '';
  const eventID = await getAsyncStorage(EVENT_ID) ?? '';

  const payload = {
    mediaFileData: {
      EventID: eventID,
      MediaURL: downloadURL,
      UserID: userId,
      Width: `${width}px`,
      height: `${height}px`,
      MediaTypeID: mediaTypeId,
    }
  }
  return await MediafileRequest(payload)
    .then((response) => {
      console.log(response.message)
    })
    .catch((error) => {
      const errorBack = error?.response.data.message
      if (errorBack === "Invalid token") {
        Alert.alert("Error al subir el archivo", "Ha ocurrido un error, intente logueandose nuevamente", [
          {
            text: 'Aceptar',
          },
        ]);
      } else {
        Alert.alert("Error al subir el archivo", "Ha ocurrido un error al subir el archivo a la nube", [
          {
            text: 'Aceptar',
          },
        ]);
      }
    })
}

export async function logout() {
  await setAsyncStorage(TOKEN, '');
}
