import React from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { ImageStyle } from 'react-native-fast-image';

import Icon from '~/baseComponents/Icon';
import Image, { ImageProps } from '~/beinComponents/Image';
import { IconType } from '~/resources/icons';
import dimension from '~/theme/dimension';
import spacing, { borderRadius } from '~/theme/spacing';
import Text from '../Text';
import {
  ACTION_CONTAINER_SIZES, ACTION_ICON_SIZES, AVATAR_STYLES, PRIVACY_ICON_SIZES, PRIVACY_ICON_VIEW_SIZES,
} from './constants';

export type AvatarType =
  | 'tiny'
  | 'xSmall'
  | 'small'
  | 'base'
  | 'medium'
  | 'large'
  | 'xLarge';

export type AvatarStatus = 'online';

export interface AvatarProps extends ImageProps {
  style?: StyleProp<ImageStyle>;
  variant?: AvatarType;
  status?: AvatarStatus;
  actionIcon?: IconType;
  badge?: any;
  badgeBottom?: boolean;
  isRounded?: boolean;
  cache?: boolean;
  showBorder?: boolean;
  borderWidth?: number;
  borderColor?: string;
  badgeCheck?: boolean;
  badgeCheckSize?: number;
  iconCheckSize?: number;
  counter?: number;
  customSize?: number;
  customStyle?: StyleProp<ImageStyle>;
  backgroundColor?: string;
  privacyIcon?: IconType;
  onPressAction?: () => void;
}

const AvatarComponent: React.FC<AvatarProps> = ({
  variant = 'base',
  style,
  source,
  status,
  actionIcon,
  badge,
  badgeBottom,
  isRounded,
  showBorder = true,
  borderWidth = 2,
  borderColor,
  badgeCheck,
  badgeCheckSize = 16,
  iconCheckSize = 12,
  counter,
  customSize,
  customStyle,
  backgroundColor,
  privacyIcon,
  onPressAction,
  ...props
}: AvatarProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const avatarSize = customSize || dimension.avatarSizes[variant] || 24;
  const _borderWidth = borderWidth || dimension.avatarBorderWidth[variant] || 2;
  const _backgroundColor = backgroundColor || colors.neutral;
  const avatarContainerStyle: StyleProp<ViewStyle> = customStyle || AVATAR_STYLES[variant];
  let avatarStyle: StyleProp<ImageStyle> = customStyle || AVATAR_STYLES[variant];
  const borderStyle = showBorder ? { borderWidth: _borderWidth, borderColor: borderColor || colors.gray1 } : {};

  const styles = createStyles({
    theme, avatarSize, badgeBottom, badgeCheckSize, variant,
  });

  if (isRounded) {
    avatarStyle = [
      avatarStyle,
      { borderRadius: avatarSize / 2 },
    ];
  }

  const renderAction = () => {
    if (!onPressAction) return null;

    return (
      <View
        testID="avatar.action_icon"
        style={styles.actionView}
      >
        {actionIcon && (
          <Icon
            testID="avatar.action_icon.button"
            size={ACTION_ICON_SIZES}
            icon={actionIcon}
            tintColor={colors.neutral40}
            onPress={onPressAction}
          />
        )}
      </View>
    );
  };

  const renderStatus = () => {
    if (!status) return null;

    return (
      <View
        testID="avatar.status"
        style={styles.statusView}
      />
    );
  };

  const renderBadge = () => {
    if (!badge) return null;

    // todo update in specific case
    const badgeContainerSize = avatarSize / 2;
    const badgeSize = badgeContainerSize * 0.45;

    return (
      <Icon
        testID="avatar.badge"
        style={[styles.badge, styles.iconBadge]}
        backgroundColor={colors.white}
        size={badgeSize}
        icon={badge}
      />
    );
  };

  const renderBadgeCheck = () => {
    if (!badgeCheck) return null;

    return (
      <View
        testID="avatar.badge_check"
        style={styles.badgeCheckView}
      >
        <Icon size={iconCheckSize} icon="Check" tintColor={colors.neutral80} />
      </View>
    );
  };

  const renderCounter = () => {
    if (!counter) return null;

    return (
      <View style={[avatarStyle, styles.textStyle]}>
        <Text.BadgeXS color={theme.colors.white}>
          {`+${counter}`}
        </Text.BadgeXS>
      </View>
    );
  };

  const renderPrivacy = () => {
    if (!privacyIcon) return null;

    return (
      <View style={styles.privacyAvatarView}>
        <Icon
          icon={privacyIcon}
          size={PRIVACY_ICON_SIZES[variant]}
          tintColor={theme.colors.white}
        />
      </View>
    );
  };

  return (
    <View
      testID="avatar"
      style={[avatarContainerStyle, style]}
    >
      <View
        testID="avatar_container"
        style={[
          avatarStyle,
          source ? {} : { backgroundColor: colors.gray40 },
        ]}
      >
        <Image
          testID="avatar.image"
          style={[avatarStyle, borderStyle, { backgroundColor: _backgroundColor }]}
          source={source}
          {...props}
        />
        {renderCounter()}
        {renderStatus()}
        {renderAction()}
        {renderBadge()}
        {renderBadgeCheck()}
        {renderPrivacy()}
      </View>
    </View>
  );
};

const createStyles = ({
  theme,
  avatarSize,
  badgeBottom,
  badgeCheckSize,
  variant,
}: {
  theme: ExtendedTheme;
  avatarSize: number;
  badgeBottom: boolean;
  badgeCheckSize: number
  variant?: AvatarType;
}) => {
  const { colors } = theme;
  return StyleSheet.create({
    textStyle: {
      backgroundColor: colors.neutral60,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    badge: {
      position: 'absolute',
      borderRadius: borderRadius.small,
      right: 0,
      padding: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionView: {
      position: 'absolute',
      top: -spacing.margin.tiny,
      right: -spacing.margin.tiny,
      width: ACTION_CONTAINER_SIZES,
      height: ACTION_CONTAINER_SIZES,
      borderRadius: ACTION_CONTAINER_SIZES / 2,
      backgroundColor: colors.neutral2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusView: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: avatarSize / 3,
      height: avatarSize / 3,
      borderRadius: (avatarSize / 3) / 2,
      backgroundColor: colors.success,
      borderWidth: 1,
      borderColor: colors.white,
    },
    iconBadge: {
      top: badgeBottom ? undefined : 0,
      bottom: badgeBottom ? 0 : undefined,
    },
    badgeCheckView: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: badgeCheckSize,
      height: badgeCheckSize,
      borderRadius: badgeCheckSize / 2,
      backgroundColor: colors.success,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.white,
      shadowOffset: { width: 0, height: 1 },
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
    privacyAvatarView: {
      width: PRIVACY_ICON_VIEW_SIZES[variant],
      height: PRIVACY_ICON_VIEW_SIZES[variant],
      position: 'absolute',
      bottom: -2,
      right: -2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.blue50,
      borderRadius: spacing.borderRadius.circle,
    },
  });
};

export default AvatarComponent;
