import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Dimensions } from 'react-native';

import BottomSheet from '~/baseComponents/BottomSheet';
import ReactionDetailTab from '~/components/reaction/ReactionDetailBottomSheet/ReactionDetailTab';
import ReactionTabBar from '~/components/reaction/ReactionDetailBottomSheet/ReactionTabBar';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import useModalStore from '~/store/modal';

const screenHeight = Dimensions.get('window').height;
const modalHeight = 0.5 * screenHeight;

const ReactionDetailBottomSheet = () => {
  const reactionSheetRef: any = useRef();
  const [selectingReaction, setSelectingReaction] = useState<any>();

  const { rootNavigation } = useRootNavigation();

  const {
    isOpen, reactionsCount, initReaction, getDataParam,
  } = useModalStore((state) => state.reactionDetailBottomSheet) || {};
  const modalActions = useModalStore((state) => state.actions);

  useEffect(
    () => {
    // reset
      if (!reactionsCount) {
        setSelectingReaction(undefined);
      }
    }, [reactionsCount],
  );

  const _onClose = () => {
    modalActions.clearReactionDetailBottomSheet();
  };

  const onChangeTab = (item: any) => {
    if (item?.reactionType) {
      setSelectingReaction(item?.reactionType);
    }
  };

  const onPressItem = useCallback((item: any) => {
    if (item?.item?.isDeactivated) {
      return;
    }
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
  }, [selectingReaction, initReaction]);

  return (
    <BottomSheet
      modalizeRef={reactionSheetRef}
      isOpen={isOpen}
      onClose={_onClose}
      childrenStyle={{ height: modalHeight }}
      disableScrollIfPossible={false}
      HeaderComponent={(
        <ReactionTabBar
          reactionsCount={reactionsCount}
          initReaction={initReaction}
          onChangeTab={onChangeTab}
        />
      )}
      ContentComponent={(
        <ReactionDetailTab
          reactionType={selectingReaction || initReaction}
          getDataParam={getDataParam}
          onPressItem={onPressItem}
        />
      )}
    />
  );
};

export default ReactionDetailBottomSheet;
