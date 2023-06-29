import React, { Fragment, useState } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import {
  useSharedValue, runOnUI,
  runOnJS,
} from 'react-native-reanimated';
// eslint-disable-next-line import/no-extraneous-dependencies

import { BADGE_WIDTH } from './helper';
import ShowingBadgesItem from './ShowingBadgesItem';
import SortableBadges from './SortableBadges';
import useUserBadge from '../../fragments/BadgeCollection/store';
import spacing from '~/theme/spacing';

const defaultData = [1, 2, 3];
 interface ShowingBadgessProps {
  isShowEditButton?: boolean;
}

const ShowingBadges = ({ isShowEditButton }: ShowingBadgessProps) => {
  const offsets = defaultData.map(() => ({
    order: useSharedValue(0),
    initOrder: useSharedValue(0),
    currentOrder: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }));

  const [ready, setReady] = useState(false);
  const actions = useUserBadge((state) => state.actions);
  const isEditing = useUserBadge((state) => state.isEditing);

  const handleDragEnd = (startIndex: number, targetIndex: number) => {
    runOnJS(actions.reorderChoosingBadgesOrder)(startIndex, targetIndex);
  };

  if (!ready) {
    return (
      <View style={[styles.container, {
        justifyContent: 'center',
      }]}
      >
        { offsets.map((_, index) => (
          <View
            key={index}
            style={[styles.item, { opacity: 0 }]}
            onLayout={({
              nativeEvent: {
                layout: {
                  x, y, width, height,
                },
              },
            }) => {
              const offset = offsets[index]!;
              offset.initOrder.value = -1;
              offset.order.value = index;
              offset.currentOrder.value = index;
              offset.width.value = width + 16;
              offset.height.value = height;
              offset.originalX.value = x - 8;
              offset.originalY.value = -y;
              offset.x.value = x - 8;
              offset.y.value = -y;
              runOnUI(() => {
                'worklet';

                if (
                  offsets.filter((o) => o.initOrder.value !== -1).length === 0
                ) {
                  runOnJS(setReady)(true);
                }
              })();
            }}
          >
            <ShowingBadgesItem index={index} />
          </View>
        ))}
      </View>
    );
  }

  const showEditButton = Boolean(isEditing) && Boolean(isShowEditButton);

  return (
    <View style={[styles.container]}>
      {offsets.map((_, index) => (
        <Fragment key={`${index}-f-2-${index}`}>
          <SortableBadges
            key={index}
            index={index}
            gesturesDisabled={!showEditButton}
            offsets={offsets}
            onDragEnd={handleDragEnd}
          >
            <ShowingBadgesItem
              index={index}
              isShowEditButton={showEditButton}
            />
          </SortableBadges>
        </Fragment>
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

export default ShowingBadges;
