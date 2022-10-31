/* Declare Dimensions */
import { Dimensions, Platform } from 'react-native';
import deviceInfoModule from 'react-native-device-info';

const guidelineBaseWidth = 375;

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;

// Cover image ratio -> 21:9
export const scaleCoverHeight = (widthSize = DeviceWidth) => (widthSize / 21) * 9;

export const groupProfileImageCropRatio = {
  // image crop ratio for cover photo: 25:11
  backgroundImgUrl: {
    width: 1080,
    height: 475,
  },
  // image crop ratio for avatar: 1:1 -> default, no need to define
  icon: {},
};

export const userProfileImageCropRatio = {
  // image crop ratio for cover photo: 25:11
  backgroundImgUrl: {
    width: 1080,
    height: 475,
  },
  // image crop ratio for avatar: 1:1 -> default, no need to define
  avatar: {},
};

/* Size config used for Text */
export const sizes = {
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 17,
  h5: 15,
  h6: 13,
  subtitleL: 17,
  subtitleM: 15,
  subtitleS: 13,
  subtitleXS: 11,
  bodyM: 15,
  bodyMMedium: 15,
  bodyS: 13,
  bodySMedium: 13,
  bodyXS: 11,
  bodyXSMedium: 11,
  paragraphL: 17,
  paragraphM: 15,
  paragraphS: 13,
  buttonL: 15,
  buttonM: 15,
  buttonS: 13,
  tabL: 15,
  tabM: 13,
  tabS: 11,
  linkM: 15,
  linkS: 13,
  badgeL: 16,
  badgeM: 12,
  badgeS: 10,
  badgeXS: 9,
  labelL: 17,
  labelM: 15,
  labelS: 13,
  dropdownM: 15,
  dropdownS: 13,
  numberM: 15,
  numberS: 13,
  captionS: 11,
  code: 16,
  error: 16,
  mdH1: 22,
  mdH2: 20,
  mdH3: 18,
  mdH4: 16,
  mdParagraph: 14,
};

/* Line Height used for Text */
export const lineHeights = {
  h1: 48,
  h2: 42,
  h3: 36,
  h4: 32,
  h5: 26,
  h6: 24,
  subtitleL: 26,
  subtitleM: 24,
  subtitleS: 20,
  subtitleXS: 16,
  bodyM: 24,
  bodyMMedium: 24,
  bodyS: 20,
  bodySMedium: 20,
  paragraphL: 28,
  paragraphM: 24,
  paragraphS: 22,
  buttonL: 26,
  buttonM: 24,
  buttonS: 20,
  tabL: 26,
  tabM: 24,
  tabS: 20,
  linkM: 22,
  linkS: 20,
  badgeL: 22,
  badgeM: 20,
  badgeS: 16,
  badgeXS: 14,
  labelL: 26,
  labelM: 22,
  dropdownM: 22,
  dropdownS: 20,
  numberM: 22,
  numberS: 20,
  captionS: 16,
  code: 24,
  error: 24,
};

export const letterSpacing = {
  base: 0,
  h1: 0,
  h2: 0,
  h3: 0,
  h4: 0,
  h5: 0,
  h6: 0,
  bodyM: 0,
  bodyS: 0,
  error: 0,
  code: 0,
};

/* Device Dimensions */
export const deviceDimensions = {
  phone: 375,
  smallTablet: 600,
  bigTablet: 768,
};

/* Used for button size width (short, medium, long, max) */
export const sizeButton = {
  short: {
    width: 113,
  },
  medium: {
    width: 158,
  },
  long: {
    width: 217,
  },
  max: {
    width: '100%',
  },
  height: 44,
};

export const avatarSizes = {
  tiny: 24,
  xSmall: 28,
  small: 32,
  base: 40,
  medium: 48,
  large: 64,
  xLarge: 80,
};

export const avatarBorderWidth = {
  tiny: 1,
  xSmall: 1,
  small: 1,
  base: 1,
  medium: 2,
  large: 2,
  xLarge: 2,
};

export const headerHeight = 60;
export const primaryItemHeight = 64;
export const commentBarHeight = 44;
export const postToolbarHeight = 52;
export const maxNewsfeedWidth = 584;
export const bottomBarHeight = 52;
export const permissionRoleSectionHeaderHeight = 56;

export const homeHeaderLogoHeight = 48;
export const homeHeaderTabHeight = 44;
export const homeHeaderHeight = homeHeaderLogoHeight + homeHeaderTabHeight;
const isPhoneWithInsets = Platform.OS === 'ios' && deviceInfoModule.hasNotch();

export const scaleSize = (size: number): number => (DeviceWidth / guidelineBaseWidth) * size;

export default {
  sizes,
  lineHeights,
  deviceDimensions,
  sizeButton,
  letterSpacing,
  headerHeight,
  homeHeaderHeight,
  primaryItemHeight,
  avatarSizes,
  avatarBorderWidth,
  commentBarHeight,
  postToolbarHeight,
  maxNewsfeedWidth,
  bottomBarHeight,
  deviceWidth: DeviceWidth,
  deviceHeight: DeviceHeight,
  isPhoneWithInsets,
};
