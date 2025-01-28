import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity } from 'react-native'
import { StepOnboarding } from '../../common/stepOnboarding';
import { globalStyles } from '../../styles/globalStyles';
import { cameraIcons } from '../../common/icons';
import { OnboardingButtonProps, OnboardingProps } from './Onboarding.type';
import { colors } from '../../common/colors';
import { handleOnboarding } from '../../helpers/helper';

const OnboardingButton = ({ OnPress, content, index }: OnboardingButtonProps) => {
  return (
    <TouchableOpacity style={content === "text" ? styles.button : null} onPress={OnPress}>
      {content === "text" ? (
        <Text style={styles.buttonText}>{index === 2 ? "Comenzar" : "Siguiente"}</Text>
      ) : (
        <Image style={styles.arrow} source={cameraIcons.arrowBack} />
      )}
    </TouchableOpacity>
  )
}

const Onboarding = ({ setCompletedOnboarding }: OnboardingProps) => {
  
  const [index, setIndex] = useState(0);

  const handleNextOnboarding = () => {
    if (StepOnboarding.length - 1 === index) return handleOnboarding(setCompletedOnboarding, "true");
    setIndex(index + 1);
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Image source={StepOnboarding[index].img} style={styles.img} />

      <Text style={styles.text1}>{StepOnboarding[index].title}</Text>
      <Text style={styles.text2}>{StepOnboarding[index].description}</Text>

      <View style={styles.indicator}>
        <View style={[styles.circle, StepOnboarding[index].id === 0 && styles.circleActive]} />
        <View style={[styles.circle, StepOnboarding[index].id === 1 && styles.circleActive]} />
        <View style={[styles.circle, StepOnboarding[index].id === 2 && styles.circleActive]} />
      </View>

      <View style={styles.buttonContainer}>
        {index === 0 ? (
          <OnboardingButton
            OnPress={handleNextOnboarding}
            content='text'
            index={StepOnboarding[index].id}
          />
        ) : (
          <>
            <OnboardingButton
              OnPress={() => setIndex(index - 1)}
              content='image'
              index={StepOnboarding[index].id}
            />
            <OnboardingButton
              OnPress={handleNextOnboarding}
              content='text'
              index={StepOnboarding[index].id}
            />
          </>
        )}
      </View>
    </View>
  )
}

export default Onboarding

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.black,
  },
  img: {
    width: 270,
    height: 270,
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  text2: {
    color: colors.white,
    width: "70%",
    paddingTop: 24,
    textAlign: "center",
    fontSize: 13,
  },
  indicator: {
    flexDirection: "row",
    position: "absolute",
    bottom: 130,
    alignItems: "center",
  },
  circle: {
    marginHorizontal: 5,
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: colors.greyB4,
  },
  circleActive: {
    width: 13,
    height: 13,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    position: "absolute",
    flexDirection: "row",
    bottom: 40,
  },
  button: {
    marginHorizontal: 13,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.greyD9,
  },
  buttonText: {
    fontWeight: "bold",
  },
  arrow: {
    width: 48,
    height: 48,
  },
});