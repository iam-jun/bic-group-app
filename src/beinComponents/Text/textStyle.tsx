import {StyleSheet} from 'react-native';
import {fontFamilies} from '~/theme/fonts';
import {letterSpacing, lineHeights, sizes} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';


export const createStyle = (theme:ITheme) => {
  const {colors} = theme;

  return (StyleSheet.create({
    h1: {
      fontFamily: fontFamilies.PoppinsSemiBold,
      fontSize: sizes.h1,
      lineHeight: lineHeights.h1,
      letterSpacing: letterSpacing.h1,
      color: colors.textPrimary,
    },
    h2: {
      fontFamily: fontFamilies.PoppinsSemiBold,
      fontSize: sizes.h2,
      lineHeight: lineHeights.h2,
      letterSpacing: letterSpacing.h2,
      color: colors.textPrimary,
    },
    h3: {
      fontFamily: fontFamilies.PoppinsSemiBold,
      fontSize: sizes.h3,
      lineHeight: lineHeights.h3,
      letterSpacing: letterSpacing.h3,
      color: colors.textPrimary,
    },
    h4: {
      fontFamily: fontFamilies.PoppinsMedium,
      fontSize: sizes.h4,
      lineHeight: lineHeights.h4,
      letterSpacing: letterSpacing.h4,
      color: colors.textPrimary,
    },
    h5: {
      fontFamily: fontFamilies.PoppinsMedium,
      fontSize: sizes.h5,
      lineHeight: lineHeights.h5,
      letterSpacing: letterSpacing.h5,
      color: colors.textPrimary,
    },
    h6: {
      fontFamily: fontFamilies.PoppinsMedium,
      fontSize: sizes.h6,
      lineHeight: lineHeights.h6,
      letterSpacing: letterSpacing.h6,
      color: colors.textPrimary,
    },
    bodyM: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: sizes.bodyM,
      lineHeight: lineHeights.bodyM,
      letterSpacing: letterSpacing.bodyM,
      color: colors.textPrimary,
    },
    body: {
      fontFamily: fontFamilies.Segoe,
      fontSize: sizes.body,
      lineHeight: lineHeights.body,
      letterSpacing: letterSpacing.body,
      color: colors.textPrimary,
    },
    bodySM: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: sizes.bodySM,
      lineHeight: lineHeights.bodySM,
      letterSpacing: letterSpacing.bodySM,
      color: colors.textPrimary,
    },
    bodyS: {
      fontFamily: fontFamilies.Segoe,
      fontSize: sizes.bodyS,
      lineHeight: lineHeights.bodyS,
      letterSpacing: letterSpacing.bodyS,
      color: colors.textPrimary,
    },
    subtitle: {
      fontFamily: fontFamilies.Segoe,
      fontSize: sizes.subtitle,
      lineHeight: lineHeights.subtitle,
      letterSpacing: letterSpacing.subtitle,
      color: colors.textPrimary,
    },
  }));
}
