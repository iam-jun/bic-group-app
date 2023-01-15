import { IPayloadPutEditComment } from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import streamApi from '~/api/StreamApi';
import { timeOut } from '~/utils/common';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { getMentionsFromContent } from '~/helpers/post';
import useCommentInputStore from '~/screens/comments/components/CommentInputView/store';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

const navigation = withNavigation(rootNavigationRef);

const editComment = (_set, _get) => async (payload: IPayloadPutEditComment) => {
  const { id, comment, data } = payload;
  if (!id || !data || !comment) {
    console.error('\x1b[31m🐣️ saga putEditPost: id or data not found\x1b[0m');
    return;
  }
  try {
    useCommentInputStore.getState().actions.setCreateComment({ loading: true });

    // get mentions from temp selected in mention input
    const { mentionInput } = Store.store.getState();
    const tempMentions = mentionInput?.tempSelected;
    const newMentions = getMentionsFromContent(
      data?.content, tempMentions,
    );
    data.mentions = { ...comment?.mentions, ...newMentions };

    const response = await streamApi.putEditComment(
      id, data,
    );

    const newComment = response.data;
    useCommentsStore.getState().actions.addToComments(newComment);

    Store.store.dispatch(modalActions.showHideToastMessage({ content: 'post:edit_comment_success' }));
    timeOut(500);
    navigation.goBack();
    useCommentInputStore.getState().actions.setCreateComment({ loading: false, content: '' });
  } catch (e) {
    useCommentInputStore.getState().actions.setCreateComment({ loading: false });
    showError(e);
  }
};

export default editComment;
