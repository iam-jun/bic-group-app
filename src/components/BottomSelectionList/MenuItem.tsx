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

interface MenuItemProps {
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

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  leftIcon,
  leftIconProps,
  rightIcon,
  rightIconProps,
  style,
  onPress,
  disabled,
  testID,
}: MenuItemProps) => {
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
        {!!leftIcon && <Icon icon={leftIcon} size={20} tintColor={colors.neutral20} {...leftIconProps} />}
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
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      alignItems: 'center',
    },
    title: {
      marginLeft: spacing.margin.small,
    },
  });
};

export default MenuItem;
