import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ReactionType } from '~/constants/reactions';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import {
  IOwnReaction, IPayloadReactToPost, IReactionCounts, TargetType,
} from '~/interfaces/IPost';
import useCommonController from '~/screens/store';
import modalActions from '~/storeRedux/modal/actions';
import postActions from '~/storeRedux/post/actions';

export interface Props {
  postId: string;
  ownerReactions: IOwnReaction;
  reactionsCount: IReactionCounts;
  targetType?: TargetType;
}

const useContentActions = (props: Props) => {
  const {
    postId, ownerReactions, reactionsCount, targetType,
  } = props;
  const dispatch = useDispatch();

  const commonController = useCommonController((state) => state.actions);

  const onPressMarkSeenPost = useCallback(() => {
    dispatch(postActions.putMarkSeenPost({ postId }));
  }, [postId]);

  const onAddReaction = (reactionId: ReactionType) => {
    const data: IPayloadReactToPost = {
      id: postId,
      reactionId,
      ownReaction: ownerReactions,
      reactionsCount,
    };
    commonController.reactToPost({ type: 'put', data, targetType });
    onPressMarkSeenPost();
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    const data: IPayloadReactToPost = {
      id: postId,
      reactionId,
      ownReaction: ownerReactions,
      reactionsCount,
    };
    commonController.reactToPost({ type: 'delete', data });
  };

  const onLongPressReaction = (reactionType: ReactionType) => {
    const payload: IPayloadReactionDetailBottomSheet = {
      isOpen: true,
      reactionsCount,
      initReaction: reactionType,
      getDataParam: { target: 'POST', targetId: postId },
    };
    dispatch(modalActions.showReactionDetailBottomSheet(payload));
  };

  return {
    onAddReaction,
    onRemoveReaction,
    onLongPressReaction,
    onPressMarkSeenPost,
  };
};

export default useContentActions;
