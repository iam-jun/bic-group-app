import React from 'react';
import {StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {useTheme, Button} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {colors} from '~/theme/configs';

const configColors: IObject<any> = colors;

export interface Props {
  title?: string;
  contentStyle?: StyleProp<ViewStyle>;
  labelStyles?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  small?: boolean;
  medium?: boolean;
  large?: boolean;
  theme?: IObject<any>;
  baseBorder?: boolean;
  smallBorder?: boolean;
  largeBorder?: boolean;
  bigBoder?: boolean;
  uppercase?: boolean;
  RightIcon?: any;
  hasRightIcon?: boolean;
  disabledShadow?: boolean;
  secondaryColor?: boolean;
  thirdColor?: boolean;
  disabledDarkMode?: boolean;
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  [x: string]: any;
}

const ButtonPaper: React.FC<Props> = ({
  title,
  small,
  medium,
  large,
  theme,
  baseBorder,
  smallBorder,
  largeBorder,
  bigBoder,
  contentStyle,
  labelStyles,
  mode,
  uppercase,
  hasRightIcon,
  RightIcon,
  disabledShadow,
  secondaryColor,
  thirdColor,
  disabledDarkMode,
  onPress,
  ...propsPaper
}) => {
  const themeDefault: IObject<any> = useTheme();
  const {dimension, spacing} = themeDefault;
  const {sizeButton} = dimension;
  const {borderRadius} = spacing;
  const configButton = small
    ? sizeButton.small
    : medium
    ? sizeButton.medium
    : large
    ? sizeButton.large
    : {};
  const configRoundness = baseBorder
    ? borderRadius.base
    : smallBorder
    ? borderRadius.small
    : largeBorder
    ? borderRadius.large
    : bigBoder
    ? borderRadius.big
    : borderRadius.base;
  const modeBtn = mode ? mode : 'contained';
  const uppercaseBtn = uppercase ? uppercase : false;

  const contentBtnStyle: any = {
    flexDirection: 'row-reverse',
  };

  return (
    <Button
      uppercase={uppercaseBtn}
      mode={modeBtn}
      onPress={onPress}
      labelStyle={StyleSheet.flatten([
        {fontSize: dimension.sizes.h4},
        labelStyles,
      ])}
      icon={({color}) => (hasRightIcon ? <RightIcon color={color} /> : null)}
      contentStyle={StyleSheet.flatten([
        configButton,
        {height: sizeButton.height},
        secondaryColor &&
          themeDefault.dark && {
            backgroundColor: thirdColor
              ? themeDefault.colors.white
              : themeDefault.colors.background,
          },
        disabledDarkMode && {
          backgroundColor: configColors.light.colors.primary,
        },
        disabledShadow && styles.disableShadowStyle,
        contentStyle,
        hasRightIcon && contentBtnStyle,
      ])}
      theme={{
        roundness: configRoundness,
        ...theme,
      }}
      {...propsPaper}>
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  disableShadowStyle: {
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderWidth: 0,
  },
});

ButtonPaper.defaultProps = {
  title: '',
  contentStyle: {},
  theme: {},
  small: false,
  medium: false,
  large: false,
  baseBorder: false,
  smallBorder: false,
  largeBorder: true,
  bigBoder: false,
  hasRightIcon: false,
  disabledShadow: false,
  secondaryColor: false,
  thirdColor: false,
  disabledDarkMode: false,
};

export default ButtonPaper;
