import { Media } from "../../screen/EventGallery/EventGallery.type";

export type GalleryModalType = {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modalVisible: boolean;
  data: Media[];
  selectedIndex: number | null,
}