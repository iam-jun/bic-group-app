import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';
import Text, {TextProps} from '~/beinComponents/Text';
import {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';
import {useDispatch} from 'react-redux';
import {clearToastMessage} from '~/store/modal/actions';
import ButtonWrapper from '../Button/ButtonWrapper';

export interface ToastMessageProps {
  type?: 'error' | 'success' | 'informative';
  children?: React.ReactNode;
  textProps?: TextProps;
  leftIcon?: IconType;
  rightIcon?: IconType;
  rightText?: string;
  style?: StyleProp<ViewStyle>;
  onActionPress?: () => void;
  onButtonPress?: () => void;
}

const ToastMessage: FC<ToastMessageProps> = ({
  type = 'informative',
  children,
  textProps,
  leftIcon,
  rightIcon,
  rightText,
  style,
  onActionPress,
  onButtonPress,
}: ToastMessageProps) => {
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const _onPress = () => {
    onActionPress?.();
    dispatch(clearToastMessage());
  };

  const ToastMessageStyle = {
    success: {
      iconColor: colors.success,
      textColor: colors.iconTintReversed,
      backgroundColor: colors.success,
    },
    error: {
      iconColor: colors.error,
      textColor: colors.iconTintReversed,
      backgroundColor: colors.error,
    },
    informative: {
      iconColor: colors.iconTint,
      textColor: colors.iconTintReversed,
      backgroundColor: colors.borderFocus,
    },
  };

  const {iconColor, textColor, backgroundColor} =
    ToastMessageStyle[type] || ToastMessageStyle.success;

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      flexDirection: 'row',
      backgroundColor: backgroundColor,
      padding: spacing.padding.base,
      borderRadius: 6,
      alignSelf: 'baseline',
      alignItems: 'center',
    },
    style,
  ]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={containerStyle}
      onPress={_onPress}>
      {leftIcon && (
        <Icon
          isButton
          iconStyle={[
            styles.leftIconStyle,
            {backgroundColor: colors.iconTintReversed},
          ]}
          style={styles.leftIcon}
          size={18}
          icon={leftIcon}
          tintColor={iconColor}
        />
      )}

      <View style={styles.textContainer}>
        <View style={styles.childrenStyle}>
          <Text.Body {...textProps} color={textColor}>
            {children}
          </Text.Body>
        </View>

        {rightIcon && rightText && (
          <ButtonWrapper style={styles.button} onPress={onButtonPress}>
            <Icon
              icon={rightIcon}
              tintColor={theme.colors.background}
              style={styles.marginRightIcon}
            />
            <Text.ButtonBase
              style={styles.rightText}
              color={theme.colors.background}>
              {rightText}
            </Text.ButtonBase>
          </ButtonWrapper>
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    textContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    childrenStyle: {
      flex: 1,
    },
    leftIcon: {
      marginRight: spacing.margin.base,
    },
    leftIconStyle: {padding: 2, borderRadius: 6},
    marginRightIcon: {marginRight: spacing.margin.tiny},
    button: {
      marginLeft: spacing.margin.base,
    },
    rightText: {textDecorationLine: 'underline'},
  });
};

export default ToastMessage;
