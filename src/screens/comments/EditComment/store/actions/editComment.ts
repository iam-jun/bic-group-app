import { IPayloadPutEditComment } from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import streamApi from '~/api/StreamApi';
import { timeOut } from '~/utils/common';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import useCommentInputStore from '~/screens/comments/components/CommentInputView/store';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import { getMentionsFromContent } from '~/helpers/post';

const navigation = withNavigation(rootNavigationRef);

const editComment = (_set, _get) => async (payload: IPayloadPutEditComment) => {
  const { id, comment, data } = payload;

  if (!id || !data || !comment) {
    console.error('\x1b[31m🐣️ edit comment: id or data not found\x1b[0m');
    return;
  }
  try {
    useCommentInputStore.getState().actions.setCreateComment({ loading: true });

    const tempMentions = useMentionInputStore.getState().tempSelected;
    const newMentions = getMentionsFromContent(
      data?.content, tempMentions,
    );
    data.mentions = { ...comment?.mentions, ...newMentions };

    const response = await streamApi.putEditComment(
      id, data,
    );

    const newComment = response.data;
    useCommentsStore.getState().actions.addToComments(newComment);

    showToast({ content: 'post:edit_comment_success' });
    timeOut(500);
    navigation.goBack();
    useCommentInputStore.getState().actions.setCreateComment({ loading: false, content: '' });
  } catch (e) {
    useCommentInputStore.getState().actions.setCreateComment({ loading: false });
    showToastError(e);
  }
};

export default editComment;
