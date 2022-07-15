// Override the theme in react native navigation to accept our custom theme props.
import {
  DarkTheme as _DarkTheme,
  DefaultTheme as _DefaultTheme,
} from '@react-navigation/native/lib/typescript/src';

declare module '@react-navigation/native' {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      black: string;
      white: string;
      danger: string;
      success: string;
      warning: string;

      neutral1: string;
      neutral5: string;
      neutral10: string;
      neutral20: string;
      neutral30: string;
      neutral40: string;
      neutral50: string;
      neutral60: string;
      neutral70: string;
      neutral80: string;
      neutral90: string;

      gray1: string;
      gray5: string;
      gray10: string;
      gray20: string;
      gray30: string;
      gray40: string;
      gray50: string;
      gray60: string;
      gray70: string;
      gray80: string;
      gray90: string;

      purple1: string;
      purple5: string;
      purple10: string;
      purple20: string;
      purple30: string;
      purple40: string;
      purple50: string;
      purple60: string;

      blue1: string;
      blue5: string;
      blue10: string;
      blue20: string;
      blue30: string;
      blue40: string;
      blue50: string;
      blue60: string;

      red1: string;
      red5: string;
      red10: string;
      red20: string;
      red30: string;
      red40: string;
      red50: string;
      red60: string;

      green1: string;
      green5: string;
      green10: string;
      green20: string;
      green30: string;
      green40: string;
      green50: string;
      green60: string;

      slate1: string;
      slate5: string;
      slate10: string;
      slate20: string;
      slate30: string;
      slate40: string;
      slate50: string;
      slate60: string;

      violet1: string;
      violet5: string;
      violet10: string;
      violet20: string;
      violet30: string;
      violet40: string;
      violet50: string;
      violet60: string;

      turquoise1: string;
      turquoise5: string;
      turquoise10: string;
      turquoise20: string;
      turquoise30: string;
      turquoise40: string;
      turquoise50: string;
      turquoise60: string;

      transparent: string;
      transparent1: string;
    };
  };
  export function useTheme(): ExtendedTheme;
  export type DarkTheme = typeof _DarkTheme;
  export type DefaultTheme = typeof _DefaultTheme;
}
