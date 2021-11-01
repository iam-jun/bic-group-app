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

export interface ToastMessageProps {
  type?: 'error' | 'success' | 'informative';
  children?: React.ReactNode;
  textProps?: TextProps;
  style?: StyleProp<ViewStyle>;
  onActionPress?: () => void;
}

const ToastMessage: FC<ToastMessageProps> = ({
  type = 'informative',
  children,
  textProps,
  style,
  onActionPress,
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
      leftIcon: 'Check' as IconType,
      iconColor: colors.success,
      textColor: colors.iconTintReversed,
      backgroundColor: colors.success,
    },
    error: {
      leftIcon: 'Globe' as IconType,
      iconColor: colors.error,
      textColor: colors.iconTintReversed,
      backgroundColor: colors.error,
    },
    informative: {
      leftIcon: 'TrashAlt' as IconType,
      iconColor: colors.iconTint,
      textColor: colors.iconTintReversed,
      backgroundColor: colors.borderFocus,
    },
  };

  const {leftIcon, iconColor, textColor, backgroundColor} =
    ToastMessageStyle[type] || ToastMessageStyle.success;

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      flexDirection: 'row',
      backgroundColor: backgroundColor,
      padding: spacing.padding.base,
      borderRadius: 6,
      alignSelf: 'baseline',
    },
    style,
  ]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={containerStyle}
      onPress={_onPress}>
      <Icon
        isButton
        iconStyle={[
          styles.iconStyle,
          {backgroundColor: colors.iconTintReversed},
        ]}
        style={styles.leftIcon}
        size={18}
        icon={leftIcon}
        tintColor={iconColor}
      />
      <View style={styles.textContainer}>
        <Text.Body {...textProps} color={textColor}>
          {children}
        </Text.Body>
      </View>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      marginRight: spacing.margin.base,
    },
    leftIcon: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.base,
    },
    iconStyle: {padding: 2, borderRadius: 6},
  });
};

export default ToastMessage;
