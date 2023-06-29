import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import {
  runOnUI,
  runOnJS,
} from 'react-native-reanimated';

import { BADGE_WIDTH, Offset } from './helper';
import spacing from '~/theme/spacing';
import ShowingBadgesItem from './ShowingBadgesItem';

interface ComputeLayoutsProps {
  offsets: Offset[];
  onReady: (ready: boolean) => void;
}

const ComputeLayout = ({ offsets, onReady }: ComputeLayoutsProps) => {
  const onLayout = (e: any, index: number) => {
    const {
      x, y, width, height,
    } = e.nativeEvent.layout;
    const offset = offsets[index]!;
    offset.initOrder.value = -1;
    offset.order.value = index;
    offset.currentOrder.value = index;
    offset.width.value = width + spacing.margin.large;
    offset.height.value = height;
    offset.originalX.value = x - spacing.margin.small;
    offset.originalY.value = -y;
    offset.x.value = x - spacing.margin.small;
    offset.y.value = -y;
    runOnUI(() => {
      'worklet';

      if (
        offsets.filter((o) => o.initOrder.value !== -1).length === 0
      ) {
        runOnJS(onReady)(true);
      }
    })();
  };

  return (
    <View style={styles.container}>
      { offsets.map((_, index) => (
        <View
          key={`compute.${index}`}
          style={[styles.item, { opacity: 0 }]}
          onLayout={(e) => { onLayout(e, index); }}
        >
          <ShowingBadgesItem index={index} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.padding.large,
    minHeight: BADGE_WIDTH + spacing.padding.large * 2,
    justifyContent: 'center',
  },
  item: {
    marginHorizontal: 8,
    borderRadius: 8,
    width: BADGE_WIDTH,
    height: BADGE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ComputeLayout;
