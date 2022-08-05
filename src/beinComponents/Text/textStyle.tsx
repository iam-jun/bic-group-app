import { StyleSheet } from 'react-native';
import { ExtendedTheme } from '@react-navigation/native';

import { sizes } from '~/theme/dimension';
import { fontFamilies } from '~/theme/fonts';

export const createTextStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  const style = {
    h1: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h1,
      // lineHeight: lineHeights.h1,
      color: colors.neutral80,
    },
    h2: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h2,
      // lineHeight: lineHeights.h2,
      color: colors.neutral80,
    },
    h3: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h3,
      // lineHeight: lineHeights.h3,
      color: colors.neutral80,
    },
    h4: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h4,
      // lineHeight: lineHeights.h4,
      color: colors.neutral80,
    },
    h5: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h5,
      // lineHeight: lineHeights.h5,
      color: colors.neutral80,
    },
    h6: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h6,
      // lineHeight: lineHeights.h6,
      color: colors.neutral80,
    },
    subtitleL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleL,
      // lineHeight: lineHeights.subtitleL,
      color: colors.neutral80,
    },
    subtitleM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleM,
      // lineHeight: lineHeights.subtitleM,
      color: colors.neutral80,
    },
    subtitleS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleS,
      // lineHeight: lineHeights.subtitleS,
      color: colors.neutral80,
    },
    subtitleXS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleXS,
      // lineHeight: lineHeights.subtitleXS,
      color: colors.neutral80,
    },
    bodyM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.bodyM,
      // lineHeight: lineHeights.bodyM,
      color: colors.neutral40,
    },
    bodyMMedium: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.bodyMMedium,
      // lineHeight: lineHeights.bodyMMedium,
      color: colors.neutral80,
    },
    bodyS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.bodyS,
      // lineHeight: lineHeights.bodyS,
      color: colors.neutral80,
    },
    bodySMedium: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.bodySMedium,
      // lineHeight: lineHeights.bodySMedium,
      color: colors.neutral80,
    },
    bodyXS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.bodyXS,
      color: colors.neutral80,
    },
    bodyXSMedium: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.bodyXSMedium,
      color: colors.neutral80,
    },
    paragraphL: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.paragraphL,
      // lineHeight: lineHeights.paragraphL,
      color: colors.neutral80,
    },
    paragraphM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.paragraphM,
      // lineHeight: lineHeights.paragraphM,
      color: colors.neutral80,
    },
    paragraphS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.paragraphS,
      // lineHeight: lineHeights.paragraphS,
      color: colors.neutral80,
    },
    buttonL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.buttonL,
      color: colors.neutral80,
    },
    buttonM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.buttonM,
      color: colors.neutral80,
    },
    buttonS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.buttonS,
      color: colors.neutral80,
    },
    tabL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.tabL,
      color: colors.neutral80,
    },
    tabM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.tabM,
      color: colors.neutral80,
    },
    tabS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.tabS,
      color: colors.neutral80,
    },
    linkM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.linkM,
      color: colors.blue50,
    },
    linkS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.linkS,
      color: colors.blue50,
    },
    badgeL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeL,
      color: colors.neutral80,
    },
    badgeM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeM,
      color: colors.neutral80,
    },
    badgeS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeS,
      color: colors.neutral80,
    },
    badgeXS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeXS,
      color: colors.neutral80,
    },
    labelL: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.labelL,
      color: colors.neutral80,
    },
    labelM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.labelM,
      color: colors.neutral80,
    },
    labelS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.labelS,
      color: colors.neutral80,
    },
    dropdownM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.dropdownM,
      color: colors.neutral80,
    },
    dropdownS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.dropdownS,
      color: colors.neutral80,
    },
    numberM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.numberM,
      color: colors.neutral80,
    },
    numberS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.numberS,
      color: colors.neutral80,
    },
    captionS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.captionS,
      color: colors.neutral80,
    },
    code: {
      fontFamily: fontFamilies.JetBrainsMono,
      fontSize: sizes.code,
      // lineHeight: lineHeights.code,
      color: colors.neutral80,
    },
  };

  return StyleSheet.create(style);
};
