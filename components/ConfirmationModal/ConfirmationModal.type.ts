import React from "react";

export type ConfirmationModalProps = {
  modalVisible: boolean,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  onConfirm: () => void,
  confirmationMessage: string,
};