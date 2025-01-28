export interface ActionModalProps {
  modalVisible: boolean;
  setActionModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLogoutModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setOnboardingStatus: React.Dispatch<React.SetStateAction<string>>;
};