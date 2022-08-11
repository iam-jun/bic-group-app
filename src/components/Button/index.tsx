import React from 'react';
import {
  ActivityIndicator,
  StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ButtonWrapper, { ButtonWrapperProps } from './ButtonWrapper';
import Text from '~/beinComponents/Text';
import { getButtonColors } from './helper';
import { ButtonSize, ButtonType, ButtonVariant } from './interface';
import {
  BUTTON_PADDING, BUTTON_SIZES, ICON_SIZES, TEXT_SIZES,
} from './constants';
import spacing, { borderRadius, padding } from '~/theme/spacing';
import { IconType } from '~/resources/icons';
import Icon from '~/beinComponents/Icon';

export interface ButtonProps extends ButtonWrapperProps {
  variant?: ButtonVariant;
  type?: ButtonType;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  useI18n?: boolean;
  icon?: IconType;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  variant = 'neutral',
  type = 'solid',
  size = 'medium',
  style,
  disabled,
  loading,
  useI18n,
  icon,
  children,
  ...props
}: ButtonProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const makeGetButtonColors = getButtonColors(theme);
  const buttonColors = makeGetButtonColors[variant]?.[type];
  let buttonSate = 'default'
  if (loading) buttonSate = 'loading';
  if (disabled) buttonSate = 'disabled';

  const textVariant = TEXT_SIZES[size];
  const buttonHeight = BUTTON_SIZES[size];
  const iconSize = ICON_SIZES[textVariant];

  const buttonVariantStyle = {
    height: buttonHeight,
    backgroundColor: buttonColors[buttonSate],
    paddingHorizontal: BUTTON_PADDING[size],
  }

  const renderIcon = () => {
    if (loading || !icon) return null;

    return (
      <Icon
        testID="button_wrapper.icon"
        icon={icon}
        tintColor={buttonColors?.text}
        size={iconSize}
      />
    );
  };

  const renderLoading = () => {
    if (!loading) return null;

    return (
      <ActivityIndicator
        color={colors.neutral20}
        style={styles.loading}
        size={iconSize}
        testID="button.loading"
      />
    );
  };

  return (
    <ButtonWrapper
      {...props}
      TouchableComponent={TouchableHighlight}
      disabled={disabled}
      underlayColor={buttonColors.loading}
      style={[style]}
    >
      <View
        testID="button.content"
        style={[styles.container, buttonVariantStyle]}
      >
        {renderLoading()}
        {renderIcon()}
        {!!children && (
          <Text
            variant={textVariant}
            style={[styles.text, icon && styles.icon]}
            color={disabled || loading ? colors.neutral20 : buttonColors.text}
            useI18n={useI18n}
          >
            {children}
          </Text>
        )}
      </View>
    </ButtonWrapper>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.base,
    paddingVertical: padding.tiny,
  },
  icon: {
    marginHorizontal: spacing.margin.small,
  },
  loading: {
    marginRight: spacing.margin.small,
  },
  text: {
    textAlign: 'center',
  },
});

const Primary : React.FC<ButtonProps> = (
  props: ButtonProps,
) => <ButtonComponent {...props} variant="primary" />;

const Button = Object.assign(
  ButtonComponent, {
    Primary,
  },
);

export default Button;
