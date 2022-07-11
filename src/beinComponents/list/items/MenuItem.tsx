import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';
import {NotificationsBadgeComponentProps} from '~/beinComponents/Badge/NotificationsBadge/NotificationsBadgeComponent';
import Icon, {IconProps} from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import {IOption} from '~/interfaces/IOption';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {ITheme} from '~/theme/interfaces';
import spacing from '~/theme/spacing';

interface MenuItemProps extends IOption {
  RightComponent?: React.ReactNode | React.ReactElement;
  onPress?: () => void;
  disabled?: boolean;
  notificationsBadgeNumber?: number;
  notificationsBadgeProps?: NotificationsBadgeComponentProps;
  badgeColor?: string;
  testID?: string;
  iconProps?: IconProps;
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
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme = useTheme() as ITheme;
  const {colors} = theme || {};
  const styles = themeStyles(theme);

  let badgeNumber;
  if (type === 'draftPost') {
    const draftPost = useKeySelector(postKeySelector.draft.posts) || [];
    badgeNumber = draftPost?.length || 0;
    badgeColor = colors.borderCard;
    if (badgeNumber > 9) {
      badgeNumber = '9+';
    }
  }

  return (
    <View>
      <TouchableOpacity
        disabled={!isInternetReachable || disabled || !onPress}
        onPress={onPress}
        testID={testID}>
        <View style={[styles.container, style]}>
          {icon && <Icon icon={icon} size={24} {...iconProps} />}
          <View style={styles.titleContainer}>
            <Text.ButtonBase testID="menu_item.title" useI18n>
              {title}
            </Text.ButtonBase>
            {!!subTitle && (
              <Text.Subtitle
                testID="menu_item.sub_title"
                numberOfLines={2}
                useI18n>
                {subTitle}
              </Text.Subtitle>
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
                color={theme.colors.iconTint}
                useI18n>
                {rightSubTitle}
              </Text.BodyS>
            )}
            {!!rightSubIcon && (
              <Icon
                testID="menu_item.right_sub_icon"
                icon={rightSubIcon}
                style={styles.rightSubIcon}
              />
            )}
          </View>
          {!!badgeNumber && (
            <View
              testID="menu_item.badge_number"
              style={[
                styles.badgeNumberContainer,
                badgeColor ? {backgroundColor: badgeColor} : {},
              ]}>
              <Text.Subtitle
                testID="menu_item.badge_number.number"
                style={styles.badgeNumber}>
                {badgeNumber}
              </Text.Subtitle>
            </View>
          )}
          {RightComponent}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
      alignItems: 'center',
    },
    titleContainer: {
      flex: 1,
      marginLeft: spacing.margin.large,
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
      color: colors.textReversed,
      marginTop: -2,
    },
  });
};

export default MenuItem;
