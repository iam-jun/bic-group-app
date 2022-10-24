import { dimension, spacing } from '~/theme';

export const AVATAR_STYLES = {
  tiny: {
    width: dimension.avatarSizes.tiny,
    height: dimension.avatarSizes.tiny,
    borderRadius: spacing.borderRadius.small,
  },
  xSmall: {
    width: dimension.avatarSizes.xSmall,
    height: dimension.avatarSizes.xSmall,
    borderRadius: spacing.borderRadius.small,
  },
  small: {
    width: dimension.avatarSizes.small,
    height: dimension.avatarSizes.small,
    borderRadius: spacing.borderRadius.base,
  },
  base: {
    width: dimension.avatarSizes.base,
    height: dimension.avatarSizes.base,
    borderRadius: spacing.borderRadius.base,
  },
  medium: {
    width: dimension.avatarSizes.medium,
    height: dimension.avatarSizes.medium,
    borderRadius: spacing.borderRadius.large,
  },
  large: {
    width: dimension.avatarSizes.large,
    height: dimension.avatarSizes.large,
    borderRadius: spacing.borderRadius.large,
  },
  xLarge: {
    width: dimension.avatarSizes.xLarge,
    height: dimension.avatarSizes.xLarge,
    borderRadius: spacing.borderRadius.large,
  },
};

export const PRIVACY_ICON_VIEW_SIZES = {
  tiny: 10,
  xSmall: 12,
  small: 12,
  base: 20,
  medium: 24,
  large: 28,
  xLarge: 32,
};

export const PRIVACY_ICON_SIZES = {
  tiny: 6,
  xSmall: 8,
  small: 8,
  base: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
};

export const ACTION_CONTAINER_SIZES = 20;

export const ACTION_ICON_SIZES = 12;
