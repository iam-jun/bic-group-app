/* Declare Dimensions */
import {Dimensions} from 'react-native';

const guidelineBaseWidth = 375;

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;

// Cover image ratio -> 25:11
export const scaleCoverHeight = (widthSize: number) => (widthSize / 25) * 11;

export const groupProfileImageCropRatio = {
  // image crop ratio for cover photo: 25:11
  background_img_url: {
    width: 1080,
    height: 475,
  },
  // image crop ratio for avatar: 1:1 -> default, no need to define
  icon: {},
};

export const userProfileImageCropRatio = {
  // image crop ratio for cover photo: 25:11
  background_img_url: {
    width: 1080,
    height: 475,
  },
  // image crop ratio for avatar: 1:1 -> default, no need to define
  avatar: {},
};

/* Size config used for Text */
export const sizes = {
  base: 14,
  h1: 36,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 16,
  h6: 14,
  h6s: 14,
  buttonBase: 16,
  buttonSmall: 12,
  bodyM: 16,
  body: 16,
  bodySM: 14,
  bodyS: 14,
  subtitle: 12,
  error: 16,
  code: 16,
  heading: 12,
};

/* Line Height used for Text */
export const lineHeights = {
  base: 24,
  h1: 44,
  h2: 36,
  h3: 32,
  h4: 28,
  h5: 24,
  h6: 20,
  h6s: 20,
  buttonBase: 24,
  buttonSmall: 16,
  bodyM: 24,
  body: 24,
  bodySM: 20,
  bodyS: 20,
  subtitle: 16,
  error: 24,
  code: 24,
  heading: 16,
};

export const letterSpacing = {
  base: 0,
  h1: 0,
  h2: 0,
  h3: 0,
  h4: 0,
  h5: 0,
  h6: 0,
  h6s: 0,
  buttonBase: 0,
  buttonSmall: 0,
  bodyM: 0,
  body: 0,
  bodySM: 0,
  bodyS: 0,
  subtitle: 0,
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

export const scaleSize = (size: number): number =>
  (DeviceWidth / guidelineBaseWidth) * size;

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
