import { StyleSheet } from 'react-native';
import { ExtendedTheme } from '@react-navigation/native';

import dimension, { sizes } from '~/theme/dimension';
import { fontFamilies } from '~/theme/fonts';

export const createTextStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  const style = {
    h1: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h1,
      color: colors.neutral80,
      lineHeight: dimension.lineHeights.h1,
    },
    h2: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h2,
      color: colors.neutral80,
      lineHeight: dimension.lineHeights.h2,
    },
    h3: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h3,
      color: colors.neutral80,
      lineHeight: dimension.lineHeights.h3,
    },
    h4: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h4,
      color: colors.neutral80,
    },
    h5: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h5,
      color: colors.neutral80,
    },
    h6: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h6,
      color: colors.neutral80,
    },
    subtitleL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleL,
      color: colors.neutral70,
    },
    subtitleM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleM,
      color: colors.neutral70,
    },
    subtitleS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleS,
      color: colors.neutral70,
    },
    subtitleXS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.subtitleXS,
      color: colors.neutral70,
    },
    bodyM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.bodyM,
      color: colors.neutral70,
      lineHeight: dimension.lineHeights.bodyM,
    },
    bodyMMedium: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.bodyMMedium,
      color: colors.neutral70,
    },
    bodyS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.bodyS,
      color: colors.neutral70,
      lineHeight: dimension.lineHeights.bodyS,
    },
    bodySMedium: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.bodySMedium,
      color: colors.neutral70,
    },
    bodyXS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.bodyXS,
      color: colors.neutral70,
    },
    bodyXSMedium: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.bodyXSMedium,
      color: colors.neutral70,
    },
    paragraphL: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.paragraphL,
      color: colors.neutral80,
    },
    paragraphM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.paragraphM,
      color: colors.neutral80,
    },
    paragraphS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.paragraphS,
      color: colors.neutral80,
    },
    buttonL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.buttonL,
      color: colors.neutral70,
    },
    buttonM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.buttonM,
      color: colors.neutral70,
      lineHeight: dimension.lineHeights.buttonM,
    },
    buttonS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.buttonS,
      color: colors.neutral70,
      lineHeight: dimension.lineHeights.buttonS,
    },
    tabL: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.tabL,
      color: colors.neutral40,
    },
    tabM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.tabM,
      color: colors.neutral40,
    },
    tabS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.tabS,
      color: colors.neutral40,
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
      color: colors.neutral40,
    },
    badgeM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeM,
      color: colors.neutral40,
    },
    badgeS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeS,
      color: colors.neutral40,
    },
    badgeXS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.badgeXS,
      color: colors.neutral40,
    },
    labelL: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.labelL,
      color: colors.neutral40,
    },
    labelM: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.labelM,
      color: colors.neutral40,
    },
    labelS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.labelS,
      color: colors.neutral40,
    },
    dropdownM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.dropdownM,
      color: colors.neutral40,
    },
    dropdownS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.dropdownS,
      color: colors.neutral40,
    },
    numberM: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.numberM,
      color: colors.neutral40,
    },
    numberS: {
      fontFamily: fontFamilies.BeVietnamProMedium,
      fontSize: sizes.numberS,
      color: colors.neutral40,
    },
    captionS: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.captionS,
      color: colors.neutral40,
      lineHeight: dimension.lineHeights.captionS,
    },
    code: {
      fontFamily: fontFamilies.JetBrainsMono,
      fontSize: sizes.code,
      color: colors.neutral80,
    },
  };

  return StyleSheet.create(style);
};
