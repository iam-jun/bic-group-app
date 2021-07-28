import {StyleSheet} from 'react-native';
import {fontFamilies} from '~/theme/fonts';
import {letterSpacing, lineHeights, sizes} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';

export const createStyle = (theme: ITheme) => {
  const {colors} = theme;

  /**
   * NOTE ABOUT FONT POPPINS
   * This font has an extra bottom space
   * => should add padding top for balancing,
   *    newLineHeight = lineHeight - paddingTop
   *    apply for H4, H5, H6, H6S, ButtonBase, ButtonSmall
   * REMOVE THIS PADDING TOP WHEN REPLACE WITH OTHER FONT
   */

  return StyleSheet.create({
    h1: {
      fontFamily: fontFamilies.PoppinsSemiBold,
      fontSize: sizes.h1,
      // lineHeight: lineHeights.h1,
      letterSpacing: letterSpacing.h1,
      color: colors.textPrimary,
    },
    h2: {
      fontFamily: fontFamilies.PoppinsSemiBold,
      fontSize: sizes.h2,
      // lineHeight: lineHeights.h2,
      letterSpacing: letterSpacing.h2,
      color: colors.textPrimary,
    },
    h3: {
      fontFamily: fontFamilies.PoppinsSemiBold,
      fontSize: sizes.h3,
      // lineHeight: lineHeights.h3,
      letterSpacing: letterSpacing.h3,
      color: colors.textPrimary,
    },
    h4: {
      fontFamily: fontFamilies.PoppinsMedium,
      fontSize: sizes.h4,
      lineHeight: 18.8 || lineHeights.h4,
      paddingTop: 5.2,
      letterSpacing: letterSpacing.h4,
      color: colors.textPrimary,
    },
    h5: {
      fontFamily: fontFamilies.PoppinsMedium,
      fontSize: sizes.h5,
      lineHeight: 15.84 || lineHeights.h5,
      paddingTop: 4.16,
      letterSpacing: letterSpacing.h5,
      color: colors.textPrimary,
    },
    h6: {
      fontFamily: fontFamilies.PoppinsMedium,
      fontSize: sizes.h6,
      lineHeight: 16.36 || lineHeights.h6,
      paddingTop: 3.64,
      letterSpacing: letterSpacing.h6,
      color: colors.textPrimary,
    },
    h6s: {
      fontFamily: fontFamilies.Poppins,
      fontSize: sizes.h6s,
      lineHeight: 16.36 || lineHeights.h6s,
      paddingTop: 3.64,
      letterSpacing: letterSpacing.h6,
      color: colors.textPrimary,
    },
    buttonBase: {
      fontFamily: fontFamilies.PoppinsMedium,
      fontSize: sizes.buttonBase,
      lineHeight: 16.36 || lineHeights.buttonBase,
      paddingTop: 3.64,
      letterSpacing: letterSpacing.buttonBase,
      color: colors.textPrimary,
    },
    buttonSmall: {
      fontFamily: fontFamilies.PoppinsMedium,
      fontSize: sizes.buttonSmall,
      lineHeight: 12.88 || lineHeights.buttonSmall,
      paddingTop: 3.12,
      letterSpacing: letterSpacing.buttonSmall,
      color: colors.textPrimary,
    },
    bodyM: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: sizes.bodyM,
      // lineHeight: lineHeights.bodyM,
      letterSpacing: letterSpacing.bodyM,
      color: colors.textPrimary,
    },
    body: {
      fontFamily: fontFamilies.Segoe,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      letterSpacing: letterSpacing.body,
      color: colors.textPrimary,
    },
    bodySM: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: sizes.bodySM,
      // lineHeight: lineHeights.bodySM,
      letterSpacing: letterSpacing.bodySM,
      color: colors.textPrimary,
    },
    bodyS: {
      fontFamily: fontFamilies.Segoe,
      fontSize: sizes.bodyS,
      // lineHeight: lineHeights.bodyS,
      letterSpacing: letterSpacing.bodyS,
      color: colors.textPrimary,
    },
    subtitle: {
      fontFamily: fontFamilies.Segoe,
      fontSize: sizes.subtitle,
      // lineHeight: lineHeights.subtitle,
      letterSpacing: letterSpacing.subtitle,
      color: colors.textPrimary,
    },
  });
};
