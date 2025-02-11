import React from 'react';
import {
  ActivityIndicator,
  Insets,
  StyleProp, StyleSheet, TouchableHighlight, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ButtonWrapper, { ButtonWrapperProps } from './ButtonWrapper';
import ButtonRaise from './ButtonRaise';
import Text from '~/baseComponents/Text';
import { getButtonColors } from './helper';
import { ButtonSize, ButtonType, ButtonVariant } from './interface';
import {
  BUTTON_PADDING, BUTTON_SIZES, ICON_SIZES, TEXT_SIZES,
} from './constants';
import spacing, { borderRadius, padding } from '~/theme/spacing';
import { IconType } from '~/resources/icons';
import Icon from '~/baseComponents/Icon';

export interface ButtonProps extends ButtonWrapperProps {
  variant?: ButtonVariant;
  type?: ButtonType;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  useI18n?: boolean;
  icon?: IconType;
  iconSize?: number;
  hitSlop?: Insets;
  isEffect?: boolean;
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
  iconSize,
  isEffect = false,
  children,
  ...props
}: ButtonProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const makeGetButtonColors = getButtonColors(theme);
  const buttonColors = makeGetButtonColors[variant]?.[type];
  let buttonState = 'default';
  if (loading) buttonState = 'loading';
  if (disabled) buttonState = 'disabled';

  const textVariant = TEXT_SIZES[size];
  const buttonHeight = BUTTON_SIZES[size];
  const iconSizeDisplay = iconSize || ICON_SIZES[size];
  const textColor = disabled || loading ? colors.neutral20 : buttonColors.text;

  const buttonVariantStyle = {
    height: buttonHeight,
    backgroundColor: buttonColors[buttonState],
    paddingHorizontal: BUTTON_PADDING[size],
  };

  const renderIcon = () => {
    if (loading || !icon) return null;
    return (
      <Icon
        testID="button.icon"
        icon={icon}
        tintColor={textColor}
        size={iconSizeDisplay}
      />
    );
  };

  const renderLoading = () => {
    if (!loading) return null;

    return (
      <ActivityIndicator
        testID="button.loading"
        color={colors.neutral20}
        style={children ? styles.loading : styles.loadingWithNoMargin}
        size={iconSizeDisplay}
      />
    );
  };

  return (
    <ButtonWrapper
      {...props}
      TouchableComponent={isEffect ? TouchableOpacity : TouchableHighlight}
      disabled={loading || disabled}
      underlayColor={buttonColors.loading}
      style={[styles.wrapper, style]}
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
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: borderRadius.large,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.large,
    paddingVertical: padding.tiny,
  },
  icon: {
    marginLeft: spacing.margin.small,
  },
  loading: {
    marginRight: spacing.margin.small,
  },
  loadingWithNoMargin: {
    marginRight: 0,
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
    Raise: ButtonRaise,
  },
);

export default Button;
