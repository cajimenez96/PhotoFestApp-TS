import React from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ButtonGeneral from '../ButtonGeneral';
import { colors } from '../../common/colors';
import { ActionModalProps } from './ActionsModal.types';

const ActionModal = ({ modalVisible, setActionModal, setLogoutModalVisible }: ActionModalProps) => {

  const handleAction = (action: () => void) => {
    return () => {
      action();
      setActionModal(false);
    };
  };

  return (
    <Modal transparent animationType='fade' visible={modalVisible} onRequestClose={() => setActionModal(false)}>
      <TouchableWithoutFeedback onPress={() => setActionModal(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>

              <ButtonGeneral style={styles.button} stylePress={styles.buttonPress} onPress={handleAction(() => setLogoutModalVisible(true))}>
                Cerrar sesion
              </ButtonGeneral>
              <ButtonGeneral style={styles.button} stylePress={styles.buttonPress}>
                Abrir pagina web
              </ButtonGeneral>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  modalContainer: {
    width: 190,
    backgroundColor: colors.white,
    borderRadius: 5,
    overflow: 'hidden',
    marginLeft: 39,
    marginTop: 60,
    paddingVertical: 12
  },
  button: {
    backgroundColor: colors.white,
    padding: 14,
    paddingHorizontal: 20
  },
  buttonPress: {
    backgroundColor: colors.transparentGrey,
  }
});

export default ActionModal;
