import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ReactionType } from '~/constants/reactions';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import { IPayloadReactToPost } from '~/interfaces/IPost';
import useCommonController from '~/screens/store';
import modalActions from '~/storeRedux/modal/actions';
import postActions from '~/storeRedux/post/actions';

const useContentActions = ({ postId, ownerReactions, reactionsCount }) => {
  const dispatch = useDispatch();

  const commonController = useCommonController((state) => state.actions);

  const onPressMarkSeenPost = useCallback(() => {
    dispatch(postActions.putMarkSeenPost({ postId }));
  }, [postId]);

  const onAddReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id: postId,
      reactionId,
      ownReaction: ownerReactions,
      reactionsCount,
    };
    commonController.reactToPost('put', payload);
    onPressMarkSeenPost();
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id: postId,
      reactionId,
      ownReaction: ownerReactions,
      reactionsCount,
    };
    commonController.reactToPost('delete', payload);
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
