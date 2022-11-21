import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle, TouchableHighlight,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import { IconType } from '~/resources/icons';
import { ButtonSize } from '~/baseComponents/Button/interface';
import {
  BUTTON_PADDING, BUTTON_SIZES, ICON_SIZES, TEXT_SIZES,
} from '~/baseComponents/Button/constants';
import ButtonWrapper, { ButtonWrapperProps } from '~/baseComponents/Button/ButtonWrapper';
import Icon from '~/baseComponents/Icon';
import spacing, { borderRadius } from '~/theme/spacing';

export interface ButtonRaiseProps extends ButtonWrapperProps{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  useI18n?: boolean;
  icon?: IconType;
  size?: ButtonSize;
  color?: string;
  backgroundColor?: string;
}

const ButtonRaise: FC<ButtonRaiseProps> = ({
  style,
  contentStyle,
  useI18n = true,
  icon,
  size = 'medium',
  color,
  backgroundColor,
  children,
  ...props
}: ButtonRaiseProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const textVariant = TEXT_SIZES[size];
  const buttonHeight = BUTTON_SIZES[size];
  const iconSize = ICON_SIZES[size];
  const _color = color || theme.colors.neutral70;
  const _backgroundColor = backgroundColor || theme.colors.neutral;

  const buttonStyle = {
    height: buttonHeight,
    backgroundColor: _backgroundColor,
    paddingHorizontal: BUTTON_PADDING[size],
  };

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <Icon
        testID="button.icon"
        icon={icon}
        tintColor={_color}
        size={iconSize}
      />
    );
  };

  return (
    <ButtonWrapper
      {...props}
      TouchableComponent={TouchableHighlight}
      style={[styles.wrapper, style]}
    >
      <View
        testID="button.content"
        style={[styles.container, contentStyle, buttonStyle]}
      >
        {renderIcon()}
        {!!children && (
          <Text
            testID="button.text"
            variant={textVariant}
            style={[styles.text, icon && styles.icon]}
            color={_color}
            useI18n={useI18n}
          >
            {children}
          </Text>
        )}
      </View>
    </ButtonWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { elevations } = theme;
  return StyleSheet.create({
    wrapper: { borderRadius: borderRadius.base },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.base,
      ...elevations.e2,
    },
    icon: {
      marginLeft: spacing.margin.small,
    },
    text: {
      textAlign: 'center',
    },
  });
};

export default ButtonRaise;
