import {IPayloadDeleteComment} from '~/interfaces/IPost';
import {put} from 'redux-saga/effects';
import * as modalActions from '~/store/modal/actions';

export default function* deleteComment({
  payload,
}: {
  type: string;
  payload: IPayloadDeleteComment;
}): any {
  console.log(
    `\x1b[34m🐣️ deleteComment deleteComment`,
    `${JSON.stringify(payload, undefined, 2)}\x1b[0m`,
  );
  const {commentId, parentCommentId, postId} = payload;
  if (!commentId) {
    console.log(`\x1b[31m🐣️ deleteComment commentId not found\x1b[0m`);
    return;
  }
  try {
    //show loading status comment
    //call api delete
    //remove comment from redux state
  } catch (e) {
    //rollback comment status then show error
    yield put(
      modalActions.showHideToastMessage({
        content: 'post:comment:text_delete_comment_error',
        props: {textProps: {useI18n: true}, type: 'error'},
      }),
    );
  }
}
