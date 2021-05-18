export const center = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const centerFull = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

export const flexRow = {
  display: 'flex',
  flexDirection: 'row',
};

export const fullWidthBox = {
  width: '100%',
};

export const fullHeightBox = {
  height: '100%',
};

export const fullBox = {
  width: '100%',
  height: '100%',
};

export const absoluteCenter = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};

export const absolute = (top: any, bottom: any, left: any, right: any) => ({
  position: 'absolute',
  bottom,
  left,
  right,
  top,
});

export default {
  center,
  centerFull,
  fullWidthBox,
  fullHeightBox,
  fullBox,
  absoluteCenter,
  flexRow,
};
