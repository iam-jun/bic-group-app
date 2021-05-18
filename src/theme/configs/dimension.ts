/* Declare Dimensions */
import {Dimensions} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;
const DiviceHeight = Dimensions.get('window').height;

/* Size config used for Text */
export const sizes = {
  base: 14,
  h1: 28,
  h2: 26,
  h3: 20,
  h4: 16,
  h5: 14,
  h6: 12,
  error: 14,
};

/* Line Height used for Text */
export const lineHeights = {
  base: 20,
  h1: 38,
  h2: 33,
  h3: 28,
  h4: 23,
  h5: 20,
  h6: 17,
  error: 20,
};

export const letterSpacing = {
  base: 0.44,
};

/* Device Dimensions */
export const dimensionDevice = {
  width: DeviceWidth,
  height: DiviceHeight,
};

/* Used for buton size (small, medium, large) */
export const sizeButton = {
  small: {
    width: '100%',
    height: 32,
  },
  medium: {
    width: '100%',
    height: 38,
  },
  large: {
    width: '100%',
    height: 46,
  },
  height: 48,
};

export default {
  sizes,
  lineHeights,
  dimensionDevice,
  sizeButton,
  letterSpacing,
};
