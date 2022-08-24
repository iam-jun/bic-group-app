import React from 'react';
import {
  StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon, { IconProps } from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import { useKeySelector } from '~/hooks/selector';

import spacing from '~/theme/spacing';
import { IconType } from '~/resources/icons';

export interface BottomListItemProps {
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  type?: string;
  title: string;
  leftIcon?: IconType;
  leftIconProps?: IconProps;
  rightIcon?: IconType;
  rightIconProps?: IconProps;
  style?: StyleProp<ViewStyle>;
}

const BottomListItem: React.FC<BottomListItemProps> = ({
  title,
  leftIcon,
  leftIconProps,
  rightIcon,
  rightIconProps,
  style,
  onPress,
  disabled,
  testID,
}: BottomListItemProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme || {};
  const styles = themeStyles(theme);

  return (
    <TouchableOpacity
      disabled={!isInternetReachable || disabled || !onPress}
      onPress={onPress}
      testID={testID}
    >
      <View style={[styles.container, style]}>
        {!!leftIcon && (
        <Icon
          icon={leftIcon}
          size={20}
          tintColor={colors.neutral20}
          style={styles.leftIcon}
          {...leftIconProps}
        />
        )}
        <Text.ButtonM style={styles.title} color={colors.neutral40} testID="menu_item.title" useI18n>
          {title}
        </Text.ButtonM>
        {
          rightIcon && <Icon icon={rightIcon} size={20} {...rightIconProps} />
        }
      </View>
    </TouchableOpacity>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
      alignItems: 'center',
    },
    leftIcon: {
      marginRight: spacing.margin.small,
    },
    title: {
    },
  });
};

export default BottomListItem;
