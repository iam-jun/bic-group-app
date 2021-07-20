/* Declare Dimensions */
import {Dimensions} from 'react-native';

const guidelineBaseWidth = 375;

const DeviceWidth = Dimensions.get('window').width;
const DiviceHeight = Dimensions.get('window').height;

/* Size config used for Text */
export const sizes = {
  base: 14,
  h1: 36,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 16,
  h6: 14,
  buttonBase: 14,
  buttonSmall: 12,
  bodyM: 14,
  body: 14,
  bodySM: 13,
  bodyS: 13,
  subtitle: 12,
  error: 14,
};

/* Line Height used for Text */
export const lineHeights = {
  base: 20,
  h1: 36,
  h2: 32,
  h3: 28,
  h4: 24,
  h5: 20,
  h6: 20,
  buttonBase: 20,
  buttonSmall: 16,
  bodyM: 20,
  body: 20,
  bodySM: 20,
  bodyS: 20,
  subtitle: 16,
  error: 20,
};

export const letterSpacing = {
  base: 0.06,
  h1: -0.17,
  h2: -0.17,
  h3: -0.17,
  h4: -0.17,
  h5: -0.17,
  h6: 0.06,
  buttonBase: 0.06,
  buttonSmall: 0.06,
  bodyM: -0.06,
  body: -0.06,
  bodySM: -0.17,
  bodyS: -0.17,
  subtitle: -0.17,
  error: 0.06,
};

/* Device Dimensions */
export const dimensionDevice = {
  width: DeviceWidth,
  height: DiviceHeight,
};

/* Used for buton size width (short, medium, long, max) */
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
  small: 24,
  medium: 36,
  large: 48,
  ultraLarge: 64,
};

export const headerHeight = 48;

export const scaleSize = (size: number) =>
  (DeviceWidth / guidelineBaseWidth) * size;

export default {
  sizes,
  lineHeights,
  dimensionDevice,
  sizeButton,
  letterSpacing,
  headerHeight,
  avatarSizes,
};
