import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { IInput } from './Input.types';
import { colors } from '../../common/colors';

const Input = ({placeholder = "", style, onChange}: IInput) => {
  const [text, onChangeText] = useState(placeholder);

  return (
    <SafeAreaView>
      <TextInput
        autoComplete="email"
        style={[styles.input, style]}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType="email-address"
        autoCapitalize="none" 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 2,
    paddingLeft: 7,
    borderBottomWidth: 1.5,
    borderColor: colors.black,
  },
});

export default Input;