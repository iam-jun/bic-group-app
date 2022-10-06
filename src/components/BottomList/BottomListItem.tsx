import React from 'react';
import {
  StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon, { IconProps } from '~/baseComponents/Icon';
import Text from '~/beinComponents/Text';
import { useKeySelector } from '~/hooks/selector';

import spacing from '~/theme/spacing';
import { IconType } from '~/resources/icons';

export interface BottomListItemProps {
  disabled?: boolean;
  testID?: string;
  type?: string;
  title: string;
  leftIcon?: IconType;
  leftIconProps?: IconProps;
  rightIcon?: IconType;
  rightIconProps?: IconProps;
  style?: StyleProp<ViewStyle>;
  upcoming?: boolean;

  onPress?: () => void;
}

const BottomListItem: React.FC<BottomListItemProps> = ({
  title,
  leftIcon,
  leftIconProps,
  rightIcon,
  rightIconProps,
  style,
  disabled,
  testID,
  upcoming,
  onPress,
}: BottomListItemProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
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
        <Text.BodyM style={styles.title} color={colors.neutral60} testID="menu_item.title" useI18n>
          {title}
        </Text.BodyM>
        {!!upcoming
        && (
        <View style={styles.upcomingStyle}>
          <Text.BadgeXS color={colors.purple50} useI18n>common:text_upcoming</Text.BadgeXS>
        </View>
        )}
        {
          rightIcon && <Icon icon={rightIcon} size={20} {...rightIconProps} />
        }
      </View>
    </TouchableOpacity>
  );
};

const themeStyles = (theme: ExtendedTheme) => StyleSheet.create({
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
  upcomingStyle: {
    backgroundColor: theme.colors.purple2,
    borderRadius: spacing.borderRadius.small,
    marginLeft: spacing.margin.small,
    paddingVertical: 2,
    paddingHorizontal: spacing.padding.xSmall,
  },
});

export default BottomListItem;
