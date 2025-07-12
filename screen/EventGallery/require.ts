import { getEventById } from "../../api/events";
import { getMediaFiles } from "../../api/mediafile";
import { EVENT_ID } from "../../common/constants";
import { getAsyncStorage } from "../../helpers/helper";
import { Media } from "./EventGallery.type";
import { AxiosError } from "axios";

export const getImages = async (
  page: number,
  setPagelimit: React.Dispatch<React.SetStateAction<boolean>>,
  setData: React.Dispatch<React.SetStateAction<Media[]>>,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsUnauthorized: React.Dispatch<React.SetStateAction<string>>
) => {
  setLoading(true)
  setIsUnauthorized("");
  try {
    const eventID = await getAsyncStorage(EVENT_ID) ?? '';
    if (!eventID) throw new Error("No event ID found");

    const response = await getMediaFiles(eventID, page)
    const { data } = response.data.data
    const { totalPages, page: currentPage } = response.data.data.pagination;

    setData((prevImages) => [
      ...prevImages,
      ...data.map((item: Media, index: number) => ({ ...item, index: prevImages.length + index })),
    ]);

    if (parseInt(currentPage) === totalPages) {
      setPagelimit(true);
    }
    setPage((prevPage) => prevPage + 1);

  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        setIsUnauthorized("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión ver las imágenes.");
      } else {
        setIsUnauthorized("Ha ocurrido un error.");
      }
    }
  } finally {
    setLoading(false)
  }
}

export const getEvent = async (setTitle: React.Dispatch<React.SetStateAction<string>>) => {
  const eventID = await getAsyncStorage(EVENT_ID) ?? '';
  try {
    const response = await getEventById(eventID)
    setTitle(response.Name)
  } catch (error) {
    console.log(error)
  }

}