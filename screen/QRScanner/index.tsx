import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Vibration, Alert } from "react-native";
import { BarcodeScanningResult } from "expo-camera";
import { globalStyles } from "../../styles/globalStyles";
import { cameraIcons } from "../../common/icons";
import { QRScannerData } from "./QRScanner.data";
import Camera from "../../components/Camera";
import { login } from "./require";
import { QRScannerProps } from "./QRScanner.type";

const QRScanner = ({ setUserLogued }: QRScannerProps) => {
  const [scanned, setScanned] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);

  const handleFlash = () => {
    Vibration.vibrate(500);
    setFlash(!flash);
  }

  const barCodeScanned = async ({ data }: BarcodeScanningResult) => {
    setScanned(true);
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      Alert.alert("Error", "El código QR escaneado no es válido.", [
        {
          text: "Aceptar",
          onPress: () => setScanned(false),
        },
      ]);
      return;
    }

    const response = await login(parsedData);

    if (response.status === 200) {
      setUserLogued(true);
    } else {
      Alert.alert(QRScannerData.userError, "", [
        {
          text: "Aceptar",
          onPress: () => setScanned(false),
        },
      ]);
    }
  };

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
});


