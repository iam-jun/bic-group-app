import {
  StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import React, { useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { borderRadius } from '~/theme/spacing';

interface ToggleProps {
  testID?: string;
  style?: StyleProp<ViewStyle>
  isChecked?: boolean;
  disableBuiltInState?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  onValueChanged?: (isChecked?: boolean) => void;
}

const Toggle = ({
  testID,
  style,
  isChecked = false,
  disableBuiltInState,
  disabled,
  size = 'small',
  onValueChanged,
}: ToggleProps) => {
  const theme = useTheme() as ExtendedTheme;
  const styles = createStyles(theme);
  const { colors } = theme;

  const [checked, setChecked] = useState(isChecked);

  const currentCheckedStatus = disableBuiltInState ? isChecked : checked;
  const currentState = disabled ? 'disabled' : (currentCheckedStatus ? 'selected' : 'unselect');

  const onPress = () => {
    setChecked(!checked);
    onValueChanged?.(!currentCheckedStatus);
  };

  const toggleStyles = {
    // based on prop `state`
    unselect: {
      rectangleColor: colors.gray20,
    },
    selected: {
      rectangleColor: colors.blue50,
    },
    disabled: {
      rectangleColor: colors.blue20,
    },

    // based on prop `size`
    medium: {
      rectangleWidth: 44,
      rectangleHeight: 24,
      circle: 28,
    },
    small: {
      rectangleWidth: 40,
      rectangleHeight: 20,
      circle: 24,
    },
  };

  const { rectangleColor } = toggleStyles[currentState];
  const { rectangleWidth, rectangleHeight, circle } = toggleStyles[size];

  const rectangleStyle: StyleProp<ViewStyle> = {
    width: rectangleWidth,
    height: rectangleHeight,
    backgroundColor: rectangleColor,
    alignItems: currentCheckedStatus || disabled ? 'flex-end' : 'flex-start',
  };

  const circleStyle: StyleProp<ViewStyle> = {
    width: circle,
    height: circle,
  };

  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.container, style]}
      disabled={!!disabled}
      onPress={onPress}
    >
      <View style={[styles.rectangle, rectangleStyle]}>
        <View style={[styles.circle, circleStyle]} />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {},
    rectangle: {
      justifyContent: 'center',
      borderRadius: borderRadius.pill,
    },
    circle: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.circle,
      borderWidth: 1,
      borderColor: colors.gray1,
    },
  });
};

export default Toggle;
