import { ExtendedTheme } from '@react-navigation/native';

export const getButtonColors = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return {
    primary: {
      solid: {
        default: colors.purple50,
        loading: colors.purple40,
        disabled: colors.purple2,
        text: colors.white,
      },
      ghost: {
        default: colors.purple2,
        loading: colors.purple1,
        disabled: colors.purple2,
        text: colors.purple50,
      },
    },
    secondary: {
      solid: {
        default: colors.blue50,
        loading: colors.blue40,
        disabled: colors.blue2,
        text: colors.white,
      },
      ghost: {
        default: colors.blue2,
        loading: colors.blue1,
        disabled: colors.blue2,
        text: colors.blue50,
      },
    },
    neutral: {
      solid: {
        default: colors.neutral20,
        loading: colors.neutral10,
        disabled: colors.neutral2,
        text: colors.neutral70,
      },
      ghost: {
        default: colors.neutral2,
        loading: colors.neutral1,
        disabled: colors.neutral2,
        text: colors.neutral70,
      },
    },
    danger: {
      solid: {
        default: colors.red40,
        loading: colors.red30,
        disabled: colors.red2,
        text: colors.white,
      },
      ghost: {
        default: colors.red2,
        loading: colors.red1,
        disabled: colors.red2,
        text: colors.red50,
      },
    },
    success: {
      solid: {
        default: colors.green50,
        loading: colors.green40,
        disabled: colors.green2,
        text: colors.white,
      },
      ghost: {
        default: colors.green2,
        loading: colors.green1,
        disabled: colors.green2,
        text: colors.green50,
      },
    },
  };
};
