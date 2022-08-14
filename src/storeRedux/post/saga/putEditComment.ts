import { put, select } from 'redux-saga/effects';
import { IPayloadPutEditComment } from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import streamApi from '~/api/StreamApi';
import showError from '~/storeRedux/commonSaga/showError';
import modalActions from '~/storeRedux/modal/actions';
import { timeOut } from '~/utils/common';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { getMentionsFromContent } from '~/screens/post/helper/PostUtils';

const navigation = withNavigation(rootNavigationRef);

function* putEditComment({
  payload,
}: {
  type: string;
  payload: IPayloadPutEditComment;
}): any {
  const { id, comment, data } = payload;
  if (!id || !data || !comment) {
    console.error('\x1b[31m🐣️ saga putEditPost: id or data not found\x1b[0m');
    return;
  }
  try {
    yield put(postActions.setCreateComment({ loading: true }));

    // get mentions from temp selected in mention input
    const tempMentions = yield select((state) => state?.mentionInput?.tempSelected);
    const newMentions = getMentionsFromContent(
      data?.content, tempMentions,
    );
    data.mentions = { ...comment?.mentions, ...newMentions };

    yield streamApi.putEditComment(
      id, data,
    );

    const newComment = { ...comment, ...data, edited: true };
    newComment.updatedAt = new Date().toISOString();
    yield put(postActions.addToAllComments(newComment));
    yield put(modalActions.showHideToastMessage({
      content: 'post:edit_comment_success',
      props: { textProps: { useI18n: true }, type: 'success' },
    }));
    yield timeOut(500);
    navigation.goBack();
    yield put(postActions.setCreateComment({ loading: false, content: '' }));
  } catch (e) {
    yield put(postActions.setCreateComment({ loading: false }));
    yield showError(e);
  }
}

export default putEditComment;
