import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { IButton } from './Button.types';

const Button = ({children, style, onClick}: IButton) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onClick}>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 42,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#060606",
  }
})

export default Button;
