import { MediafileRequest } from "../../api/mediafile"
import { Alert } from "react-native"
import { getAsyncStorage } from "../../helpers/helper";
import { USER_ID } from "../../common/constants";

export async function sendToBackend(downloadURL: string, width: number, height: number, mediaTypeId: string) {
  const userId = await getAsyncStorage(USER_ID) ?? '';

  const payload = {
    EventID: "66b6ab67d728b05b6b08ab42",
    MediaURL: downloadURL,
    UserID: userId,
    Width: `${width}px`,
    height: `${height}px`,
    MediaTypeID: mediaTypeId,
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
