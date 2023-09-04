import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Icon, { IconProps } from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';

import { IconType } from '~/resources/icons';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import spacing from '~/theme/spacing';

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
  badge?: string;
  isShowBorderTop?: boolean;
  isShowBorderBottom?: boolean;
  isDanger?: boolean;
  loading?: boolean;

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
  badge,
  loading,
  onPress,
  isShowBorderTop,
  isShowBorderBottom,
  isDanger,
}: BottomListItemProps) => {
  const isInternetReachable = useNetworkStore(
    networkSelectors.getIsInternetReachable,
  );

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  return (
    <TouchableOpacity
      disabled={!isInternetReachable || disabled || !onPress || loading}
      onPress={onPress}
      testID={testID}
    >
      {
        Boolean(loading) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.neutral20} />
          </View>
        )
      }
      <View
        style={[
          styles.container,
          isShowBorderTop && styles.borderTop,
          isShowBorderBottom && styles.borderBottom,
          style,
        ]}
      >
        {!!leftIcon && (
          <Icon
            icon={leftIcon}
            size={20}
            tintColor={isDanger ? colors.red40 : colors.neutral20}
            style={styles.leftIcon}
            {...leftIconProps}
          />
        )}
        <Text.BodyM
          style={styles.title}
          color={isDanger ? colors.red40 : colors.neutral60}
          testID="menu_item.title"
          useI18n
        >
          {title}
        </Text.BodyM>
        {!!upcoming && (
          <View style={styles.upcomingStyle}>
            <Text.BadgeXS color={colors.purple50} useI18n>
              common:text_upcoming
            </Text.BadgeXS>
          </View>
        )}
        {!!badge && (
          <View style={styles.badge}>
            <Text.BadgeS color={theme.colors.white}>{badge}</Text.BadgeS>
          </View>
        )}
        {rightIcon && <Icon icon={rightIcon} size={20} {...rightIconProps} />}
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
    flexShrink: 1,
  },
  upcomingStyle: {
    backgroundColor: theme.colors.purple2,
    borderRadius: spacing.borderRadius.small,
    marginLeft: spacing.margin.small,
    paddingVertical: 2,
    paddingHorizontal: spacing.padding.xSmall,
  },
  badge: {
    backgroundColor: theme.colors.red40,
    borderRadius: spacing.borderRadius.pill,
    paddingHorizontal: spacing.padding.tiny,
    paddingVertical: spacing.padding.xTiny,
  },
  borderTop: {
    borderTopColor: theme.colors.neutral5,
    borderTopWidth: 1,
  },
  borderBottom: {
    borderBottomColor: theme.colors.neutral5,
    borderBottomWidth: 1,
  },
  loadingContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: theme.colors.white,
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomListItem;
