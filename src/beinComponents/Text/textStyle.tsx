import {StyleSheet} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

import {sizes} from '~/theme/dimension';
import {fontFamilies} from '~/theme/fonts';

export const createTextStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;

  const style = {
    h1: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h1,
      // lineHeight: lineHeights.h1,
      color: colors.neutral80,
    },
    h2: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h2,
      // lineHeight: lineHeights.h2,
      color: colors.neutral80,
    },
    h3: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h3,
      // lineHeight: lineHeights.h3,
      color: colors.neutral80,
    },
    h4: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h4,
      // lineHeight: lineHeights.h4,
      color: colors.neutral80,
    },
    h5: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h5,
      // lineHeight: lineHeights.h5,
      color: colors.neutral80,
    },
    h6: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h6,
      // lineHeight: lineHeights.h6,
      color: colors.neutral80,
    },
    h6s: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.h6s,
      // lineHeight: lineHeights.h6s,
      color: colors.neutral80,
    },
    buttonBase: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.buttonBase,
      // lineHeight: lineHeights.buttonBase,
      color: colors.neutral80,
    },
    buttonSmall: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.buttonSmall,
      // lineHeight: lineHeights.buttonSmall,
      color: colors.neutral80,
    },
    bodyM: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.bodyM,
      // lineHeight: lineHeights.bodyM,
      color: colors.neutral80,
    },
    bodyMI: {
      fontFamily: fontFamilies.OpenSansSemiBoldItalic,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      color: colors.neutral80,
    },
    bodyI: {
      fontFamily: fontFamilies.OpenSansItalic,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      color: colors.neutral80,
    },
    body: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.body,
      // lineHeight: lineHeights.body,
      color: colors.neutral80,
    },
    bodySM: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.bodySM,
      // lineHeight: lineHeights.bodySM,
      color: colors.neutral80,
    },
    bodyS: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.bodyS,
      // lineHeight: lineHeights.bodyS,
      color: colors.neutral80,
    },
    subtitle: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.subtitle,
      // lineHeight: lineHeights.subtitle,
      color: colors.neutral80,
    },
    code: {
      fontFamily: fontFamilies.JetBrainsMono,
      fontSize: sizes.code,
      // lineHeight: lineHeights.code,
      color: colors.neutral80,
    },
    heading: {
      fontFamily: fontFamilies.OpenSans,
      fontSize: sizes.heading,
      color: colors.neutral80,
    },
    headingSB: {
      fontFamily: fontFamilies.OpenSansSemiBold,
      fontSize: sizes.heading,
      color: colors.neutral80,
    },
  };

  return StyleSheet.create(style);
};
