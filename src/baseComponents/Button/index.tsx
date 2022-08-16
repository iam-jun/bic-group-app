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
  contentStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  useI18n?: boolean;
  icon?: IconType;
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  variant = 'neutral',
  type = 'solid',
  size = 'medium',
  style,
  contentStyle,
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
  let buttonState = 'default'
  if (loading) buttonState = 'loading';
  if (disabled) buttonState = 'disabled';

  const textVariant = TEXT_SIZES[size];
  const buttonHeight = BUTTON_SIZES[size];
  const iconSize = ICON_SIZES[textVariant];
  const textColor = disabled || loading ? colors.neutral20 : buttonColors.text;

  const buttonVariantStyle = {
    height: buttonHeight,
    backgroundColor: buttonColors[buttonState],
    paddingHorizontal: BUTTON_PADDING[size],
  }

  const renderIcon = () => {
    if (loading || !icon) return null;

    return (
      <Icon
        testID="button.icon"
        icon={icon}
        tintColor={textColor}
        size={iconSize}
      />
    );
  };

  const renderLoading = () => {
    if (!loading) return null;

    return (
      <ActivityIndicator
        testID="button.loading"
        color={colors.neutral20}
        style={styles.loading}
        size={iconSize}
      />
    );
  };

  return (
    <ButtonWrapper
      {...props}
      TouchableComponent={TouchableHighlight}
      disabled={disabled}
      underlayColor={buttonColors.loading}
      style={style}
    >
      <View
        testID="button.content"
        style={[styles.container, contentStyle, buttonVariantStyle]}
      >
        {renderLoading()}
        {renderIcon()}
        {!!children && (
          <Text
            testID="button.text"
            variant={textVariant}
            style={[styles.text, icon && styles.icon]}
            color={textColor}
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
    marginLeft: spacing.margin.small,
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

const Secondary : React.FC<ButtonProps> = (
  props: ButtonProps,
) => <ButtonComponent {...props} variant="secondary" />;

const Neutral : React.FC<ButtonProps> = (
  props: ButtonProps,
) => <ButtonComponent {...props} variant="neutral" />;

const Success : React.FC<ButtonProps> = (
  props: ButtonProps,
) => <ButtonComponent {...props} variant="success" />;

const Danger : React.FC<ButtonProps> = (
  props: ButtonProps,
) => <ButtonComponent {...props} variant="danger" />;

const Button = Object.assign(
  ButtonWrapper, {
    Primary,
    Secondary,
    Neutral,
    Success,
    Danger,
  },
);

export default Button;
