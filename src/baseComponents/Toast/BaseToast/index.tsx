import {
  StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import React from 'react';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IconType } from '~/resources/icons';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import Icon from '~/baseComponents/Icon/';

export enum ToastType {
  SUCCESS = 'success',
  NEUTRAL = 'neutral',
  ERROR = 'error',
}

export interface BaseToastProps {
  style?: StyleProp<ViewStyle>;
  type?: ToastType;
  icon?: IconType;
  content?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  onClose?: () => void;
}

const BaseToast = ({
  style,
  type = ToastType.NEUTRAL,
  icon,
  content,
  buttonText,
  onButtonPress,
  onClose,
}: BaseToastProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const iconColor = {
    [ToastType.SUCCESS]: colors.green50,
    [ToastType.NEUTRAL]: colors.neutral20,
    [ToastType.ERROR]: colors.red40,
  };

  const iconName = type === ToastType.ERROR ? 'CircleExclamationSolid' : icon;

  if (!content) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {!!iconName && (
          <Icon
            size={20}
            iconStyle={styles.iconStyle}
            icon={iconName}
            tintColor={iconColor[type]}
          />
        )}
        <Text.BodyM testID="base_toast.content" style={styles.flex1} color={colors.white} useI18n>
          {content}
        </Text.BodyM>
      </View>

      <View style={styles.rightContainer}>
        {!!buttonText && (
          <TouchableOpacity style={styles.actionButton} onPress={onButtonPress} testID="toast_button_action">
            <Text.ButtonS testID="base_toast.button_text" useI18n>{buttonText}</Text.ButtonS>
          </TouchableOpacity>
        )}
        <Icon
          icon="iconClose"
          size={12}
          ignoreInternet
          tintColor={colors.neutral20}
          onPress={onClose}
          buttonTestID="base_toast.close"
        />
      </View>
    </View>
  );
};

export default BaseToast;

const createStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral80,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      marginHorizontal: spacing.margin.large,
      borderRadius: spacing.borderRadius.small,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...elevations.e3,
    },
    flex1: { flex: 1 },
    leftContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconStyle: {
      marginRight: spacing.margin.small,
    },
    rightContainer: {
      paddingLeft: spacing.margin.base,
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      backgroundColor: colors.neutral2,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.tiny,
      borderRadius: spacing.borderRadius.base,
      marginRight: spacing.margin.large,
    },
  });
};
