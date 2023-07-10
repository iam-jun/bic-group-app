import React from 'react';
import {
  StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';
import { NotificationsBadgeComponentProps } from '~/beinComponents/Badge/NotificationsBadge/NotificationsBadgeComponent';
import Icon, { IconProps } from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';

import spacing from '~/theme/spacing';
import { IconType } from '~/resources/icons';
import useDraftPostStore from '~/screens/YourContent/components/Draft/DraftPost/store';
import IDraftPostState from '~/screens/YourContent/components/Draft/DraftPost/store/Interface';

interface MenuItemProps {
  RightComponent?: React.ReactNode | React.ReactElement;
  onPress?: () => void;
  disabled?: boolean;
  notificationsBadgeNumber?: number;
  notificationsBadgeProps?: NotificationsBadgeComponentProps;
  badgeColor?: string;
  testID?: string;
  iconProps?: Partial<IconProps>;
  type?: string;
  title: string;
  subTitle?: string;
  icon?: IconType;
  rightSubTitle?: string;
  rightSubIcon?: IconType;
  style?: StyleProp<ViewStyle>;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  icon,
  rightSubTitle,
  rightSubIcon,
  subTitle,
  style,
  type,
  RightComponent,
  onPress,
  disabled,
  notificationsBadgeNumber,
  notificationsBadgeProps,
  badgeColor,
  testID,
  iconProps,
}: MenuItemProps) => {
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme || {};
  const styles = themeStyles(theme);

  let badgeNumber;
  if (type === 'draftPost') {
    const draftPost = useDraftPostStore((state:IDraftPostState) => state.posts) || [];
    badgeNumber = draftPost?.length || 0;
    badgeColor = colors.gray40;
    if (badgeNumber > 9) {
      badgeNumber = '9+';
    }
  }

  return (
    <View>
      <TouchableOpacity
        disabled={!isInternetReachable || disabled || !onPress}
        onPress={onPress}
        testID={testID}
      >
        <View style={[styles.container, style]}>
          {icon && <Icon icon={icon} size={24} {...iconProps} />}
          <View style={styles.titleContainer}>
            <Text.BodyM testID="menu_item.title" useI18n>
              {title}
            </Text.BodyM>
            {!!subTitle && (
              <Text.BodyS
                testID="menu_item.sub_title"
                numberOfLines={2}
                useI18n
              >
                {subTitle}
              </Text.BodyS>
            )}
          </View>
          {(notificationsBadgeNumber || notificationsBadgeProps) && (
            <NotificationsBadge
              number={notificationsBadgeNumber}
              {...notificationsBadgeProps}
            />
          )}
          <View style={styles.rightComponent}>
            {!!rightSubTitle && (
              <Text.BodyS
                testID="menu_item.right_sub_title"
                color={theme.colors.neutral80}
                useI18n
              >
                {rightSubTitle}
              </Text.BodyS>
            )}
            {!!rightSubIcon && (
              <Icon
                testID="menu_item.right_sub_icon"
                icon={rightSubIcon}
                size={18}
                style={styles.rightSubIcon}
              />
            )}
          </View>
          {!!badgeNumber && (
            <View
              testID="menu_item.badge_number"
              style={[
                styles.badgeNumberContainer,
                badgeColor ? { backgroundColor: badgeColor } : {},
              ]}
            >
              <Text.BodyS
                testID="menu_item.badge_number.number"
                style={styles.badgeNumber}
              >
                {badgeNumber}
              </Text.BodyS>
            </View>
          )}
          {RightComponent}
        </View>
      </TouchableOpacity>
    </View>
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
    titleContainer: {
      flex: 1,
      marginLeft: spacing.margin.small,
    },
    rightComponent: {
      flexDirection: 'row',
    },
    label: {},
    rightSubIcon: {
      marginLeft: spacing.margin.base,
    },
    badgeNumberContainer: {
      minWidth: 20,
      minHeight: 20,
      backgroundColor: colors.success,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeNumber: {
      color: colors.white,
      marginTop: -2,
    },
  });
};

export default MenuItem;
