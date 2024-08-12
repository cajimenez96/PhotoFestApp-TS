import { Image, StyleSheet, TouchableOpacity } from "react-native"
import { CameraButtonProps } from "./CameraButton.type";

const CameraButton = ({ onPress, source, typeDispatch, disableImage }: CameraButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image style={[!typeDispatch ? styles.icon : styles.iconDispatch, disableImage && styles.disabledImage]} source={source} />
    </TouchableOpacity>
  )
}

export default CameraButton

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    marginHorizontal: 20,
  },
  disabledImage: {
    opacity: 0.5,
  },
  icon: {
    height: 47,
    width: 47,
  },
  iconDispatch: {
    height: 80,
    width: 80,
  },
});
