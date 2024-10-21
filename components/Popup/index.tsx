import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { IPopup } from './Popup.types';
import { colors } from '../../common/colors';

const Popup = ({ children }: IPopup) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    maxWidth: '87%',
    backgroundColor:  colors.white,
    borderRadius: 20,
    padding: 35,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});

export default Popup;
