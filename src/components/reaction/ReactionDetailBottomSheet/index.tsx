import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, View } from 'react-native';

import { useDispatch } from 'react-redux';
import BottomSheet from '~/beinComponents/BottomSheet';
import { useKeySelector } from '~/hooks/selector';
import { clearReactionDetailBottomSheet } from '~/storeRedux/modal/actions';
import ReactionTabBar from '~/components/reaction/ReactionDetailBottomSheet/ReactionTabBar';
import ReactionDetailTab from '~/components/reaction/ReactionDetailBottomSheet/ReactionDetailTab';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import modalKeySelector from '~/storeRedux/modal/keySelector';

const screenHeight = Dimensions.get('window').height;
const contentBarHeight = 0.6 * screenHeight;

const ReactionDetailBottomSheet = () => {
  const reactionSheetRef: any = useRef();
  const [selectingReaction, setSelectingReaction] = useState<any>();

  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const data = useKeySelector(modalKeySelector.reactionDetailBottomSheet);
  const {
    isOpen, reactionCounts, initReaction, getDataPromise, getDataParam,
  } = data || {};

  useEffect(
    () => {
    // reset
      if (!reactionCounts) {
        setSelectingReaction(undefined);
      }
    }, [reactionCounts],
  );

  const _onClose = () => {
    dispatch(clearReactionDetailBottomSheet());
  };

  const onChangeTab = (item: any) => {
    if (item?.reactionType) {
      setSelectingReaction(item?.reactionType);
    }
  };

  const onPressItem = (item: any) => {
    const itemUserId = item?.item?.id;
    if (itemUserId) {
      rootNavigation.navigate(
        mainStack.userProfile, { userId: itemUserId },
      );
    } else {
      rootNavigation.navigate(
        mainStack.userProfile, {
          userId: item?.item.username,
          params: {
            type: 'username',
          },
        },
      );
    }
    reactionSheetRef?.current?.close?.();
  };

  return (
    <BottomSheet
      modalizeRef={reactionSheetRef}
      isOpen={isOpen}
      onClose={_onClose}
      ContentComponent={(
        <View>
          <ReactionTabBar
            reactionCounts={reactionCounts}
            onChangeTab={onChangeTab}
            initReaction={initReaction}
          />
          <ReactionDetailTab
            reactionType={selectingReaction || initReaction}
            height={contentBarHeight}
            onPressItem={onPressItem}
            getDataPromise={getDataPromise}
            getDataParam={getDataParam}
          />
        </View>
      )}
    />
  );
};

export default ReactionDetailBottomSheet;
