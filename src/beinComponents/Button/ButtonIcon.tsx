import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Text, ViewSpacing} from '~/components';
import {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';
import ButtonWrapper, {ButtonWrapperProps} from './ButtonWrapper';

export interface ButtonIconProps extends ButtonWrapperProps {
  icon: IconType;
  tintColor?: string;
  label?: string;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon,
  label,
  tintColor,
  ...props
}: ButtonIconProps) => {
  const theme: ITheme = useTheme();
  const {spacing} = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <ButtonWrapper
        style={styles.icon}
        leftIcon={icon}
        leftIconProps={{icon, tintColor}}
        {...props}
      />
      {label && (
        <>
          <ViewSpacing height={spacing?.margin.small} />
          <Text.ButtonSmall>{label}</Text.ButtonSmall>
        </>
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    icon: {
      backgroundColor: colors.primary1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing?.borderRadius.small,
      marginLeft: spacing?.padding.small,
      width: 36,
      height: 36,
    },
  });
};

export default ButtonIcon;
