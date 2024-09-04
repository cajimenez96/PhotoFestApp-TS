import { StyleSheet, Text, View, Switch, TouchableOpacity, Image } from 'react-native'
import { globalStyles } from '../../styles/globalStyles'
import { PermissionButtonProps, PermissionModalProps } from './PermissionModal.type';
import { cameraIcons } from '../../common/icons';
import { permissionData } from './PermissionModel.data';

const PermissionButton = ({ title, description, granted, onPress }: PermissionButtonProps) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.textView}>
      <Text style={styles.text2}>{title}</Text>
      <Text style={styles.text3}>{description}</Text>
    </View>
    <Switch
      value={granted}
      trackColor={{ false: '#3e3e3e', true: '#ad6bcf9c' }}
      disabled={true}
    />
  </TouchableOpacity>
);

const PermissionModal = ({ requestPermission, requestMediaLibraryPermission, permission, mediaLibraryPermission, microphonePermission, requestMicrophonePermission }: PermissionModalProps) => {
  return (
    <View style={[globalStyles.container, styles.container]}>

      <Image style={styles.icon} source={cameraIcons.festBookLogo}/>

      <Text style={styles.title}>Para continuar, FestBook necesita los siguientes permisos:</Text>

      <PermissionButton
        title={permissionData.titleCamera}
        description={permissionData.descCamera}
        granted={permission?.granted}
        onPress={requestPermission}
      />

      <PermissionButton
        title={permissionData.titleMicro}
        description={permissionData.descMicro}
        granted={mediaLibraryPermission?.granted}
        onPress={requestMediaLibraryPermission}
      />

      <PermissionButton
        title={permissionData.titleLibrary}
        description={permissionData.descLibrary}
        granted={microphonePermission?.granted}
        onPress={requestMicrophonePermission}
      />
    </View>
  )
}

export default PermissionModal

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: "#060606",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 50,
    fontSize: 18,
    color: "#d2d2d2",
    width: "80%",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 7,
    borderRadius: 14,
    backgroundColor: "#202020",
    marginBottom: 20,
    width: "70%",
  },
  textView: {
    width: "80%",
    paddingRight: 10,
    paddingLeft: 10,
  },
  text2: {
    fontWeight: "bold",
    color: "#d3d3d3",
  },
  text3: {
    fontSize: 12,
    color: "#bdbdbd",
  },
});
