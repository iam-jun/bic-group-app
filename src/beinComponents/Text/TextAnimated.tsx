import React from 'react';
import type {TextProps as RNTextProps} from 'react-native';
import {TextInput} from 'react-native';
import Animated, {useAnimatedProps} from 'react-native-reanimated';

import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {createTextStyle} from '~/beinComponents/Text/textStyle';
import {TextVariant} from '~/beinComponents/Text/index';

Animated.addWhitelistedNativeProps({text: true});

interface TextProps {
  sharedValue: Animated.SharedValue<string>;
  variant?: TextVariant;
  color?: string;
  style?: Animated.AnimateProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const TextAnimated = ({variant = 'bodyM', color, ...props}: TextProps) => {
  const theme: ExtendedTheme = useTheme();
  const textStyles = createTextStyle(theme);

  const _style = textStyles[variant];
  const colorStyle = {color: color || theme.colors.neutral80};

  const {sharedValue, style} = {style: {}, ...props};
  const animatedProps = useAnimatedProps(() => {
    return {text: sharedValue.value} as any;
  });
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={sharedValue.value}
      style={[_style, colorStyle, style]}
      {...{animatedProps}}
    />
  );
};

export default TextAnimated;
