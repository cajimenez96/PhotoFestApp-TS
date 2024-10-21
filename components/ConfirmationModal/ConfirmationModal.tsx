import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ConfirmationModalProps } from './ConfirmationModal.type';
import { colors } from '../../common/colors';

const ConfirmationModal = ({ modalVisible, setModalVisible, onConfirm, confirmationMessage }: ConfirmationModalProps) => {


  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{confirmationMessage || ''}</Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.closeButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={onConfirm}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparentBlack05, 
  },
  modalContent: {
    width: '70%',
    paddingTop: 30,
    paddingBottom: 0,
    backgroundColor: colors.black09,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: colors.white,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.white,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    position: 'relative',
    bottom: 0,
    borderWidth: 1,
    borderTopColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  button: {
    flex: 0.5,
    padding: 15,
    backgroundColor: colors.black09,
    borderBottomRightRadius: 19,
  },
  closeButton: {
    backgroundColor: colors.white,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 19,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold',
  },
  closeButtonText: {
    textAlign: 'center',
    color: colors.black09,
    fontWeight: 'bold',
  },
});

export default ConfirmationModal