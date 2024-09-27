import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { IInput } from './Input.types';

const Input = ({placeholder = "", style, onChange}: IInput) => {
  const [text, onChangeText] = useState(placeholder);

  return (
    <SafeAreaView>
      <TextInput
        autoComplete="email"
        style={[styles.input, style]}
        onChangeText={onChange}
        placeholder={placeholder}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 12,
    borderColor: "#767676",
    textAlign: 'center'
  },
});

export default Input;