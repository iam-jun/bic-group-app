import { isNumber } from 'lodash';

export const calculateRatio = (width: any, height: any) => {
  const _width = Number(width);
  const _height = Number(height);

  if (isNumber(_width) && isNumber(_height)) {
    const ratio = _width / _height;
    if (isNumber(ratio)) return ratio;
  }

  return 1;
};
