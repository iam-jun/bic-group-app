import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import ButtonPrimary, {
  ButtonPrimaryProps,
} from '~/beinComponents/Button/ButtonPrimary';
import {ITheme} from '~/theme/interfaces';
import LinearGradient from 'react-native-linear-gradient';

export interface ButtonBottomFixedProps extends ButtonPrimaryProps {
  bottomButtonStyle?: StyleProp<ViewStyle>;
  bottomButtonContainerStyle?: StyleProp<ViewStyle>;
  absoluteBottom?: boolean;
  linearHeight?: number;
}

const ButtonBottomFixed: React.FC<ButtonBottomFixedProps> = ({
  children,
  absoluteBottom = true,
  bottomButtonStyle,
  bottomButtonContainerStyle,
  linearHeight = 36,
  ...props
}: ButtonBottomFixedProps) => {
  const theme: ITheme = useTheme();
  const {spacing, colors} = theme;
  const styles = createStyle();

  const gradientColors = [
    colors.transparent || 'rgba(0,0,0,0)',
    colors.background,
  ];

  return (
    <View
      style={StyleSheet.flatten([
        absoluteBottom ? styles.absolute : {},
        bottomButtonContainerStyle,
      ])}>
      <LinearGradient style={{height: linearHeight}} colors={gradientColors} />
      <View
        style={StyleSheet.flatten([
          {
            backgroundColor: colors.background,
            padding: spacing?.padding.large,
          },
          bottomButtonStyle,
        ])}>
        <ButtonPrimary {...props}>{children}</ButtonPrimary>
      </View>
    </View>
  );
};

const createStyle = () => {
  return StyleSheet.create({
    absolute: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
};

export default ButtonBottomFixed;
