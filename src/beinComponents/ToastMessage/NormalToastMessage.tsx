import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Icon from '~/beinComponents/Icon';
import Text, {TextProps} from '~/beinComponents/Text';
import {IconType} from '~/resources/icons';

import {useDispatch} from 'react-redux';
import {clearToastMessage} from '~/store/modal/actions';
import ButtonWrapper from '../Button/ButtonWrapper';
import spacing from '~/theme/spacing';

export interface ToastMessageProps {
  type?: 'error' | 'success' | 'informative';
  children?: React.ReactNode;
  textProps?: TextProps;
  leftIcon?: IconType;
  leftIconColor?: string;
  leftStyle?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIcon?: IconType;
  rightText?: string;
  rightTextColor?: string;
  rightTextProps?: TextProps;
  rightTextStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  onActionPress?: () => void;
  onPressRight?: () => void;
}

const ToastMessage: FC<ToastMessageProps> = ({
  type = 'informative',
  children,
  textProps,
  leftIcon,
  leftIconColor,
  leftStyle,
  leftIconStyle,
  rightIcon,
  rightText,
  rightTextColor,
  rightTextProps,
  rightTextStyle,
  style,
  onActionPress,
  onPressRight,
}: ToastMessageProps) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;

  const _onPress = () => {
    onActionPress?.();
    dispatch(clearToastMessage());
  };

  const ToastMessageStyle = {
    success: {
      iconColor: colors.success,
      textColor: colors.neutral80,
      backgroundColor: colors.success,
    },
    error: {
      iconColor: colors.red60,
      textColor: colors.neutral80,
      backgroundColor: colors.red60,
    },
    informative: {
      iconColor: colors.neutral80,
      textColor: colors.neutral80,
      backgroundColor: colors.gray40,
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
      onPress={_onPress}
      testID="normal_toast_message">
      {leftIcon && (
        <Icon
          isButton
          testID="normal_toast_message.left_icon"
          iconStyle={[
            styles.leftIconStyle,
            {backgroundColor: colors.neutral1},
            leftIconStyle,
          ]}
          style={[styles.leftIcon, leftStyle]}
          size={18}
          icon={leftIcon}
          tintColor={leftIconColor || iconColor}
        />
      )}

      <View style={styles.textContainer}>
        <View style={styles.childrenStyle}>
          <Text.BodyM
            {...textProps}
            color={textColor}
            testID="normal_toast_message.children">
            {children}
          </Text.BodyM>
        </View>
        {!!rightText && (
          <ButtonWrapper
            style={styles.button}
            onPress={onPressRight}
            testID="normal_toast_message.right_button">
            {!!rightIcon && (
              <Icon
                testID="normal_toast_message.right_icon"
                icon={rightIcon}
                tintColor={theme.colors.white}
                style={styles.marginRightIcon}
              />
            )}
            <Text.ButtonM
              {...rightTextProps}
              testID="normal_toast_message.right_text"
              style={[styles.rightText, rightTextStyle]}
              color={rightTextColor || theme.colors.white}>
              {rightText}
            </Text.ButtonM>
          </ButtonWrapper>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default ToastMessage;
