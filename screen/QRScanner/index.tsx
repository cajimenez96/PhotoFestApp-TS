import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Vibration, Alert } from "react-native";
import { BarcodeScanningResult } from "expo-camera";
import { globalStyles } from "../../styles/globalStyles";
import { cameraIcons } from "../../common/icons";
import { QRScannerData } from "./QRScanner.data";
import Camera from "../../components/Camera";
import { login } from "./require";
import { QRScannerProps } from "./QRScanner.type";
import Popup from "../../components/Popup";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { IPayloadLogin } from "../../api/login";

const QRScanner = ({ setUserLogued }: QRScannerProps) => {
  const [scanned, setScanned] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [dataLogin, setDataLogin] = useState<IPayloadLogin>({
    UserName: "",
    Password: "",
    eventID: "",
    email: "",
  }) 
  // const [eventId, setEventId] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");

  const handleFlash = () => {
    Vibration.vibrate(500);
    setFlash(!flash);
  }

  const barCodeScanned = async ({ data }: BarcodeScanningResult) => {
    setScanned(true);
    let parsedData;
    try {
      parsedData = JSON.parse(data);
      setDataLogin({
        eventID: parsedData.EventID,
        UserName: parsedData.UserName,
        Password: parsedData.Password,
        email: dataLogin.email,
      })
    } catch (error) {
      Alert.alert("Error", "El código QR escaneado no es válido.", [
        {
          text: "Aceptar",
          onPress: () => setScanned(false),
        },
      ]);
      return;
    }

    // setEventId(parsedData.EventID);
    setOpenModal(true);
    // const response = await login(parsedData);

    // if (response.status === 200) {
    //   setUserLogued(true);
    // } else {
    //   Alert.alert(QRScannerData.userError, "", [
    //     {
    //       text: "Aceptar",
    //       onPress: () => setScanned(false),
    //     },
    //   ]);
    // }
  };

  const renderModal = () => {
    return (
      <Popup>
        <View>
          <Text style={{textAlign: 'center'}}>
            {`Para poder continuar necesito que ingreses su correo electrónico`}
          </Text>
          <Input
            placeholder="Ingrese su email"
            style={{marginTop: 50}}
            onChange={setNewEmail}
          />

          <View style={styles.buttonPopup}>
            <Button style={{width: 140}} onClick={() => {
                setDataLogin({
                  eventID: dataLogin.eventID,
                  UserName: dataLogin.UserName,
                  Password: dataLogin.Password,
                  email: newEmail,
                });


                console.log(dataLogin);
                
              }
            }>
              <Text style={styles.textCenter}>Enviar</Text>
            </Button>

            <Button style={{width: 120}} onClick={() => setOpenModal(false)}>
              <Text style={styles.textCenter}>Cancelar</Text>
            </Button>
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
    justifyContent: 'space-between',
    marginTop: 50
  },
  textCenter: {
    textAlign: 'center'
  }
});


