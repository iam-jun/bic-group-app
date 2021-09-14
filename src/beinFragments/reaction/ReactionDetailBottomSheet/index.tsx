import React, {useRef, useState, useEffect} from 'react';
import {Dimensions, View} from 'react-native';

import BottomSheet from '~/beinComponents/BottomSheet';
import {useKeySelector} from '~/hooks/selector';
import {useDispatch} from 'react-redux';
import modalKeySelector from '~/store/modal/selectors';
import {clearReactionDetailBottomSheet} from '~/store/modal/actions';
import ReactionTabBar from '~/beinFragments/reaction/ReactionDetailBottomSheet/ReactionTabBar';
import ReactionDetailTab from '~/beinFragments/reaction/ReactionDetailBottomSheet/ReactionDetailTab';
import menuActions from '~/screens/Menu/redux/actions';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

const screenHeight = Dimensions.get('window').height;
const contentBarHeight = 0.6 * screenHeight;

const ReactionDetailBottomSheet = () => {
  const reactionSheetRef: any = useRef();
  const [selectingReaction, setSelectingReaction] = useState<any>();

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const userId = useUserIdAuth();
  const data = useKeySelector(modalKeySelector.reactionDetailBottomSheet);
  const {isOpen, reactionCounts, postId, commentId, initReaction} = data || {};

  useEffect(() => {
    //reset
    if (!reactionCounts) {
      setSelectingReaction(undefined);
    }
  }, [reactionCounts]);

  const _onClose = () => {
    dispatch(clearReactionDetailBottomSheet());
  };

  const onChangeTab = (item: any) => {
    if (item?.reactionType) {
      setSelectingReaction(item?.reactionType);
    }
  };

  const onPressItem = (item: any) => {
    const itemUserId = item?.item?.user?.id;
    if (itemUserId) {
      dispatch(
        menuActions.selectedProfile({
          id: itemUserId,
          isPublic: userId !== itemUserId,
        }),
      );
      rootNavigation.navigate(homeStack.publicProfile);
    }
    reactionSheetRef?.current?.close?.();
  };

  return (
    <BottomSheet
      modalizeRef={reactionSheetRef}
      isOpen={isOpen}
      side="center"
      menuMinWidth={375}
      onClose={_onClose}
      ContentComponent={
        <View>
          <ReactionTabBar
            reactionCounts={reactionCounts}
            onChangeTab={onChangeTab}
            initReaction={initReaction}
          />
          <ReactionDetailTab
            reactionType={selectingReaction}
            postId={postId}
            height={contentBarHeight}
            onPressItem={onPressItem}
          />
        </View>
      }
    />
  );
};

export default ReactionDetailBottomSheet;
