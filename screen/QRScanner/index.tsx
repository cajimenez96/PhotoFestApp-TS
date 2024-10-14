import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Vibration, Alert } from "react-native";
import { BarcodeScanningResult } from "expo-camera";
import { globalStyles } from "../../styles/globalStyles";
import { cameraIcons } from "../../common/icons";
import { QRScannerData } from "./QRScanner.data";
import Camera from "../../components/Camera";
import { eventUserAssociation } from "./require";
import Popup from "../../components/Popup";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { isValidEmail } from "../../common/validations";

const QRScanner = () => {
  const [scanned, setScanned] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [error, setError] = useState<string>("");


  const handleFlash = () => {
    Vibration.vibrate(500);
    setFlash(!flash);
  }

  const barCodeScanned = async ({ data }: BarcodeScanningResult) => {
    setScanned(true);
    let parsedData;
    try {
      parsedData = JSON.parse(data);
      setEventId(parsedData.eventID)
      setScanned(false);
    } catch (error) {
      Alert.alert("Error", "El código QR escaneado no es válido.", [
        {
          text: "Aceptar",
          onPress: () => setScanned(false),
        },
      ]);
      return;
    }

    setOpenModal(true);
  };

  const uploadUserEvent = async () => {
    if (!isValidEmail(newEmail)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    const data = {
      EventID: eventId,
      UserName: newEmail
    }
    await eventUserAssociation(data, setOpenModal, setLoading, setError)
  }

  const cancelFunction = () => {
    setOpenModal(false);
    setScanned(false);
    setError("");
  }

  const renderModal = () => {
    return (
      <Popup>
        <View>
          <Text style={styles.title}>
            {`Para continuar, por favor ingrese su correo electronico`}
          </Text>
          <Input
            placeholder="Ingrese su correo"
            style={styles.input}
            onChange={setNewEmail}
          />

          {error && (
            <Text style={styles.textError}>{error}</Text>
          )}

          <View style={styles.buttonPopup}>
            {loading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              <>
                <Button style={[styles.buttons]} onClick={uploadUserEvent} >
                  <Text style={styles.textCenter}>Enviar</Text>
                </Button >

                <Button style={[styles.buttons, styles.buttonCancel]} onClick={cancelFunction}>
                  <Text style={styles.textCenter}>Cancelar</Text>
                </Button>
              </>
            )}
          </View>
        </View>
      </Popup>
    )
  }

  return (
    <View style={globalStyles.container}>
      {scanned ? (
        <View style={[globalStyles.container, globalStyles.centered]}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <Camera
          handleBarCodeScanned={barCodeScanned}
          torch={flash}
        >
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={handleFlash}>
              <Image source={flash ? cameraIcons.flashImg : cameraIcons.flashOffImg} style={globalStyles.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.camera}>
            <View>
              <Image source={cameraIcons.scannerImg} style={styles.image} />
            </View>
            <View style={styles.boxTranslucid}>
              <Text style={styles.text}>{QRScannerData.text}</Text>
            </View>
          </View>
        </Camera>
      )}
      {openModal && renderModal()}
    </View>
  );
}

export default QRScanner;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  boxTranslucid: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flash: {
    borderRadius: 100,
    padding: 5,
  },
  buttonPopup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
    color: "white",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15.3,
  },
  buttons: {
    width: 100,
  },
  buttonCancel: {
    marginLeft: 20,
    backgroundColor: "#262626",
  },
  input: {
    marginTop: 80,
    marginBottom: 90,
  },
  textError: {
    color: "red",
    bottom: 70,
  },
});


