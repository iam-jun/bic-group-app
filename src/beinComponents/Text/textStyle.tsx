import {StyleSheet} from 'react-native';
import {sizes} from '~/theme/dimension';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';

export const createTextStyle = (theme: ITheme) => {
  const {colors} = theme;

  const style = {
    h1: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h1,
      // lineHeight: lineHeights.h1,
      color: colors.textPrimary,
    },
    h2: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h2,
      // lineHeight: lineHeights.h2,
      color: colors.textPrimary,
    },
    h3: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h3,
      // lineHeight: lineHeights.h3,
      color: colors.textPrimary,
    },
    h4: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h4,
      // lineHeight: lineHeights.h4,
      color: colors.textPrimary,
    },
    h5: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h5,
      // lineHeight: lineHeights.h5,
      color: colors.textPrimary,
    },
    h6: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h6,
      // lineHeight: lineHeights.h6,
      color: colors.textPrimary,
    },
    h6s: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h6s,
      // lineHeight: lineHeights.h6s,
      color: colors.textPrimary,
    },
    buttonBase: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.buttonBase,
      // lineHeight: lineHeights.buttonBase,
      color: colors.textPrimary,
    },
    buttonSmall: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.buttonSmall,
      // lineHeight: lineHeights.buttonSmall,
      color: colors.textPrimary,
    },
    bodyM: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.bodyM,
      // lineHeight: lineHeights.bodyM,
      color: colors.textPrimary,
    },
    bodyMI: {
      fontFamily: fontFamilies.OpenSansSemiBoldItalic,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      color: colors.textPrimary,
    },
    bodyI: {
      fontFamily: fontFamilies.OpenSansItalic,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      color: colors.textPrimary,
    },
    body: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      color: colors.textPrimary,
    },
    bodySM: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.bodySM,
      // lineHeight: lineHeights.bodySM,
      color: colors.textPrimary,
    },
    bodyS: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.bodyS,
      // lineHeight: lineHeights.bodyS,
      color: colors.textPrimary,
    },
    subtitle: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.subtitle,
      // lineHeight: lineHeights.subtitle,
      color: colors.textPrimary,
    },
    code: {
      fontFamily: fontFamilies.JetBrainsMono,
      fontSize: sizes.code,
      // lineHeight: lineHeights.code,
      color: colors.textPrimary,
    },
    heading: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.heading,
      color: colors.textPrimary,
    },
    headingSB: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.heading,
      color: colors.textPrimary,
    },
  };

  return StyleSheet.create(style);
};
