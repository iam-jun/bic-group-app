import React from 'react';
import {
  ImageStyle, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';
import Image, { ImageProps } from '~/beinComponents/Image';
import { IconType } from '~/resources/icons';
import dimension from '~/theme/dimension';

import spacing, { borderRadius } from '~/theme/spacing';
import Text from '../../beinComponents/Text';

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
  onPressAction?: () => void;
  backgroundColor?: string;
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
  onPressAction,
  backgroundColor,
  ...props
}: AvatarProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = creatStyle(theme);

  const avatarSize = customSize || dimension?.avatarSizes[variant] || 24;
  const _borderWidth = borderWidth || dimension.avatarBorderWidth[variant] || 2;
  const _backgroundColor = backgroundColor || colors.neutral;
  const avatarContainerStyle: StyleProp<ViewStyle> = customStyle || styles[variant];
  let avatarStyle: StyleProp<ImageStyle> = customStyle || styles[variant];
  const borderStyle = showBorder ? { borderWidth: _borderWidth, borderColor: borderColor || colors.gray1 } : {};

  if (isRounded) {
    avatarStyle = [
      avatarStyle,
      { borderRadius: avatarSize / 2 },
    ];
  }

  const renderAction = () => {
    if (!onPressAction) {
      return null;
    }

    const actionContainerSize = 16;
    const actionIconSize = 12;

    return (
      <View
        testID="avatar.action_icon"
        style={{
          position: 'absolute',
          top: -(spacing?.margin.tiny || 4),
          right: -(spacing?.margin.tiny || 4),
          width: actionContainerSize,
          height: actionContainerSize,
          borderRadius: actionContainerSize / 2,
          backgroundColor: colors.white,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {actionIcon && (
          <Icon
            testID="avatar.action_icon.button"
            size={actionIconSize}
            icon={actionIcon}
            onPress={onPressAction}
          />
        )}
      </View>
    );
  };

  const renderStatus = () => {
    if (!status) {
      return null;
    }

    // todo update in specific case
    const statusSize = avatarSize / 3;
    const statusColor = colors.success;

    return (
      <View
        testID="avatar.status"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: statusSize,
          height: statusSize,
          borderRadius: statusSize / 2,
          backgroundColor: statusColor,
          borderWidth: 1,
          borderColor: colors.white,
        }}
      />
    );
  };

  const renderBadge = () => {
    if (!badge) {
      return null;
    }

    // todo update in specific case
    const badgeContainerSize = avatarSize / 2;
    const badgeSize = badgeContainerSize * 0.45;

    return (
      <Icon
        testID="avatar.badge"
        style={[styles.badge, {
          top: badgeBottom ? undefined : 0,
          bottom: badgeBottom ? 0 : undefined,
        }]}
        backgroundColor={colors.white}
        size={badgeSize}
        icon={badge}
      />
    );
  };

  const renderBadgeCheck = () => {
    if (!badgeCheck) {
      return null;
    }
    return (
      <View
        testID="avatar.badge_check"
        style={{
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
        }}
      >
        <Icon size={iconCheckSize} icon="Check" tintColor={colors.neutral80} />
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
        {counter ? (
          <View style={[avatarStyle, styles.textStyle]}>
            <Text.BodyS color={theme.colors.white}>
              +
              {counter}
            </Text.BodyS>
          </View>
        ) : null}
        {renderStatus()}
        {renderAction()}
        {renderBadge()}
        {renderBadgeCheck()}
      </View>
    </View>
  );
};

const creatStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.gray1,
      padding: 2,
      borderRadius: borderRadius.small,
    },
    tiny: {
      width: dimension.avatarSizes.tiny,
      height: dimension.avatarSizes.tiny,
      borderRadius: (dimension.avatarSizes.tiny || 16) / 2,
    },
    small: {
      width: dimension.avatarSizes.small,
      height: dimension.avatarSizes.small,
      borderRadius: spacing.borderRadius.small,
    },
    xSmall: {
      width: dimension.avatarSizes.xSmall,
      height: dimension.avatarSizes.xSmall || 28,
      borderRadius: spacing.borderRadius.small,
    },
    base: {
      width: dimension.avatarSizes.base,
      height: dimension.avatarSizes.base,
      borderRadius: spacing.borderRadius.small,
    },
    medium: {
      width: dimension.avatarSizes.medium,
      height: dimension.avatarSizes.medium,
      borderRadius: spacing.borderRadius.small,
    },
    large: {
      width: dimension.avatarSizes.large,
      height: dimension.avatarSizes.large,
      borderRadius: spacing.borderRadius.small,
    },
    xLarge: {
      width: dimension.avatarSizes.xLarge,
      height: dimension.avatarSizes.xLarge || 90,
      borderRadius: spacing.borderRadius.small,
    },
    textStyle: {
      backgroundColor: colors.transparent1,
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
  });
};

export default AvatarComponent;
