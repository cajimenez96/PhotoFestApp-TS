import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { ButtonGeneralProps } from './ButtonGeneral.types';
import { colors } from '../../common/colors';

const ButtonGeneral: React.FC<ButtonGeneralProps> = ({ onPress, style, stylePress, children }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [style, pressed && stylePress]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.black,
    fontSize: 16,
  },
});

export default ButtonGeneral;
