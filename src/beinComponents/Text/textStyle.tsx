import {Platform, StyleSheet} from 'react-native';
import {fontFamilies} from '~/theme/fonts';
import {letterSpacing, lineHeights, sizes} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';

export const createTextStyle = (theme: ITheme) => {
  const {colors} = theme;

  const style = {
    h1: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h1,
      // lineHeight: lineHeights.h1,
      letterSpacing: letterSpacing.h1,
      color: colors.textPrimary,
    },
    h2: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h2,
      // lineHeight: lineHeights.h2,
      letterSpacing: letterSpacing.h2,
      color: colors.textPrimary,
    },
    h3: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h3,
      // lineHeight: lineHeights.h3,
      letterSpacing: letterSpacing.h3,
      color: colors.textPrimary,
    },
    h4: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h4,
      // lineHeight: lineHeights.h4,
      letterSpacing: letterSpacing.h4,
      color: colors.textPrimary,
    },
    h5: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h5,
      // lineHeight: lineHeights.h5,
      letterSpacing: letterSpacing.h5,
      color: colors.textPrimary,
    },
    h6: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h6,
      // lineHeight: lineHeights.h6,
      letterSpacing: letterSpacing.h6,
      color: colors.textPrimary,
    },
    h6s: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h6s,
      lineHeight: lineHeights.h6s,
      letterSpacing: letterSpacing.h6,
      color: colors.textPrimary,
    },
    buttonBase: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.buttonBase,
      lineHeight: lineHeights.buttonBase,
      letterSpacing: letterSpacing.buttonBase,
      color: colors.textPrimary,
    },
    buttonSmall: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.buttonSmall,
      lineHeight: lineHeights.buttonSmall,
      letterSpacing: letterSpacing.buttonSmall,
      color: colors.textPrimary,
    },
    bodyM: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.bodyM,
      // lineHeight: lineHeights.bodyM,
      letterSpacing: letterSpacing.bodyM,
      color: colors.textPrimary,
    },
    bodyMI: {
      fontFamily: fontFamilies.OpenSansSemiBoldItalic,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      letterSpacing: letterSpacing.body,
      color: colors.textPrimary,
    },
    bodyI: {
      fontFamily: fontFamilies.OpenSansItalic,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      letterSpacing: letterSpacing.body,
      color: colors.textPrimary,
    },
    body: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      letterSpacing: letterSpacing.body,
      color: colors.textPrimary,
    },
    bodySM: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.bodySM,
      // lineHeight: lineHeights.bodySM,
      letterSpacing: letterSpacing.bodySM,
      color: colors.textPrimary,
    },
    bodyS: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.bodyS,
      // lineHeight: lineHeights.bodyS,
      letterSpacing: letterSpacing.bodyS,
      color: colors.textPrimary,
    },
    subtitle: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.subtitle,
      // lineHeight: lineHeights.subtitle,
      letterSpacing: letterSpacing.subtitle,
      color: colors.textPrimary,
    },
    code: {
      fontFamily: fontFamilies.JetBrainsMono,
      fontSize: sizes.code,
      lineHeight: lineHeights.code,
      letterSpacing: letterSpacing.code,
      color: colors.textPrimary,
    },
  };

  if (Platform.OS === 'web') {
    return style;
  } else {
    return StyleSheet.create(style);
  }
};
