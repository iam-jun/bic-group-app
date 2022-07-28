/* Declare Dimensions */
import { Dimensions } from 'react-native';

const guidelineBaseWidth = 375;

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;

// Cover image ratio -> 25:11
export const scaleCoverHeight = (widthSize: number) => (widthSize / 25) * 11;

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
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 17,
  h6: 15,
  subtitleL: 17,
  subtitleM: 15,
  subtitleS: 13,
  subtitleXS: 11,
  bodyM: 15,
  bodyMMedium: 15,
  bodyS: 13,
  bodySMedium: 13,
  paragraphL: 17,
  paragraphM: 15,
  paragraphS: 13,
  buttonL: 17,
  buttonM: 15,
  buttonS: 13,
  tabL: 17,
  tabM: 15,
  tabS: 13,
  linkM: 15,
  linkS: 13,
  badgeL: 15,
  badgeM: 13,
  badgeS: 11,
  badgeXS: 9,
  labelL: 18,
  labelM: 15,
  dropdownM: 15,
  dropdownS: 13,
  numberM: 15,
  numberS: 13,
  captionS: 11,
  code: 16,
  error: 16,
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
  subtitleM: 22,
  subtitleS: 20,
  subtitleXS: 16,
  bodyM: 22,
  bodyMMedium: 22,
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
  tiny: 16,
  small: 24,
  smallAlt: 32,
  medium: 40,
  large: 48,
  largeAlt: 72,
  ultraSuperLarge: 96,
};

export const headerHeight = 60;
export const primaryItemHeight = 64;
export const commentBarHeight = 44;
export const postToolbarHeight = 52;
export const maxNewsfeedWidth = 584;
export const bottomBarHeight = 60;
export const permissionRoleSectionHeaderHeight = 56;

export const scaleSize = (size: number): number => (DeviceWidth / guidelineBaseWidth) * size;

export default {
  sizes,
  lineHeights,
  deviceDimensions,
  sizeButton,
  letterSpacing,
  headerHeight,
  primaryItemHeight,
  avatarSizes,
  commentBarHeight,
  postToolbarHeight,
  maxNewsfeedWidth,
  bottomBarHeight,
  deviceWidth: DeviceWidth,
  deviceHeight: DeviceHeight,
};
