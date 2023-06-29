import Animated from 'react-native-reanimated';
// eslint-disable-next-line import/no-extraneous-dependencies
import { move } from 'react-native-redash';

export const BADGE_WIDTH = 48;
export const MARGIN_VERTICAL = 8;

type SharedValues<T extends Record<string, string | number | boolean>> = {
  [K in keyof T]: Animated.SharedValue<T[K]>;
};
export type Offset = SharedValues<{
  order: number;
  currentOrder: number;
  width: number;
  height: number;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
}>;

const byCurrentOrder = (a: Offset, b: Offset) => {
  'worklet';

  return a.currentOrder.value > b.currentOrder.value ? 1 : -1;
};

export const reorder = (input: Offset[], from: number, to: number) => {
  'worklet';

  const offsets = input.sort(byCurrentOrder);
  const newOffset = move(offsets, from, to);
  // eslint-disable-next-line no-return-assign
  newOffset.map((offset, index) => (offset.currentOrder.value = index));
};

export const calculateLayout = (input: Offset[], containerWidth: number) => {
  'worklet';

  const offsets = input.sort(byCurrentOrder);
  if (offsets.length === 0) {
    return;
  }
  const defaultX = offsets.find((o) => o.order.value === 0)?.originalX?.value;

  offsets.forEach((offset, index) => {
    const total = offsets
      .slice(0, index)
      .reduce((acc, o) => acc + o.width.value, defaultX);
    if (total + offset.width.value > containerWidth) {
      offset.x.value = defaultX;
    } else {
      offset.x.value = total;
    }
    offset.y.value = offset.originalY.value;
  });
};
