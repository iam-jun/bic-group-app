import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import {IconType} from '~/resources/icons';

import ButtonWrapper, {ButtonWrapperProps} from './ButtonWrapper';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

export interface ButtonIconProps extends ButtonWrapperProps {
  style?: StyleProp<ViewStyle>;
  iconWrapperStyle?: StyleProp<ViewStyle>;
  icon: IconType;
  tintColor?: string;
  label?: string;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  style,
  icon,
  label,
  tintColor,
  iconWrapperStyle,
  ...props
}: ButtonIconProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View testID="button_icon" style={[styles.container, style]}>
      <ButtonWrapper
        style={[styles.icon, iconWrapperStyle]}
        leftIcon={icon}
        leftIconProps={{icon, tintColor}}
        {...props}
      />
      {label && (
        <Text.ButtonS testID="button_icon.label" style={styles.label}>
          {label}
        </Text.ButtonS>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    icon: {
      backgroundColor: colors.violet1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing.borderRadius.small,
      width: 36,
      height: 36,
    },
    label: {
      marginTop: spacing.margin.small,
      textAlign: 'center',
    },
  });
};

export default ButtonIcon;
