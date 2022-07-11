import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';
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
  const theme: ITheme = useTheme() as ITheme;
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
        <Text
          testID="button_icon.label"
          variant="buttonSmall"
          style={styles.label}>
          {label}
        </Text>
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    icon: {
      backgroundColor: colors.primary1,
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
