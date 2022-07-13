import {StyleSheet} from 'react-native';
import {sizes} from '~/theme/dimension';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';

export const createTextStyle = (theme: ITheme) => {
  const {colors} = theme;

  const style = {
    h1: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h1,
      // lineHeight: lineHeights.h1,
      color: colors.textPrimary,
    },
    h2: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h2,
      // lineHeight: lineHeights.h2,
      color: colors.textPrimary,
    },
    h3: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h3,
      // lineHeight: lineHeights.h3,
      color: colors.textPrimary,
    },
    h4: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h4,
      // lineHeight: lineHeights.h4,
      color: colors.textPrimary,
    },
    h5: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h5,
      // lineHeight: lineHeights.h5,
      color: colors.textPrimary,
    },
    h6: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h6,
      // lineHeight: lineHeights.h6,
      color: colors.textPrimary,
    },
    subtitleL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleL,
      // lineHeight: lineHeights.subtitleL,
      color: colors.textPrimary,
    },
    subtitleM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleM,
      // lineHeight: lineHeights.subtitleM,
      color: colors.textPrimary,
    },
    subtitleS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleS,
      // lineHeight: lineHeights.subtitleS,
      color: colors.textPrimary,
    },
    subtitleXS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleXS,
      // lineHeight: lineHeights.subtitleXS,
      color: colors.textPrimary,
    },
    bodyM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.bodyM,
      // lineHeight: lineHeights.bodyM,
      color: colors.textPrimary,
    },
    bodyMMedium: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.bodyMMedium,
      // lineHeight: lineHeights.bodyMMedium,
      color: colors.textPrimary,
    },
    bodyS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.bodyS,
      // lineHeight: lineHeights.bodyS,
      color: colors.textPrimary,
    },
    bodySMedium: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.bodySMedium,
      // lineHeight: lineHeights.bodySMedium,
      color: colors.textPrimary,
    },
    paragraphL: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.paragraphL,
      // lineHeight: lineHeights.paragraphL,
      color: colors.textPrimary,
    },
    paragraphM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.paragraphM,
      // lineHeight: lineHeights.paragraphM,
      color: colors.textPrimary,
    },
    paragraphS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.paragraphS,
      // lineHeight: lineHeights.paragraphS,
      color: colors.textPrimary,
    },
    buttonL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.buttonL,
      color: colors.textPrimary,
    },
    buttonM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.buttonM,
      color: colors.textPrimary,
    },
    buttonS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.buttonS,
      color: colors.textPrimary,
    },
    tabL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.tabL,
      color: colors.textPrimary,
    },
    tabM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.tabM,
      color: colors.textPrimary,
    },
    tabS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.tabS,
      color: colors.textPrimary,
    },
    linkM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.linkM,
      color: colors.link,
    },
    linkS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.linkS,
      color: colors.link,
    },
    badgeL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeL,
      color: colors.textPrimary,
    },
    badgeM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeM,
      color: colors.textPrimary,
    },
    badgeS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeS,
      color: colors.textPrimary,
    },
    badgeXS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeXS,
      color: colors.textPrimary,
    },
    labelL: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.labelL,
      color: colors.textPrimary,
    },
    labelM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.labelM,
      color: colors.textPrimary,
    },
    dropdownM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.dropdownM,
      color: colors.textPrimary,
    },
    dropdownS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.dropdownS,
      color: colors.textPrimary,
    },
    numberM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.numberM,
      color: colors.textPrimary,
    },
    numberS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.numberS,
      color: colors.textPrimary,
    },
    captionS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.captionS,
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
