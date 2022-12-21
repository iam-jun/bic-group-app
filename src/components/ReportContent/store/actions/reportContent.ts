import StreamApi from '~/api/StreamApi';
import Store from '~/storeRedux';
import usePostsStore from '~/store/entities/posts';
import useCommentsStore from '~/store/entities/comments';
import { IPayloadAddToAllPost, ICommentData } from '~/interfaces/IPost';
import modalActions from '~/storeRedux/modal/actions';
import showError from '~/store/helper/showError';
import { IPayloadReportContent, TargetType } from '~/interfaces/IReport';

const reportContent = () => async (payload: IPayloadReportContent) => {
  const {
    targetId,
    groupIds,
    targetType,
    reportTo,
    reasonType,
    reason,
    dataComment,
  } = payload || {};
  const { parentCommentId } = dataComment || {};

  try {
    await StreamApi.reportContent({
      targetId,
      groupIds,
      targetType,
      reportTo,
      reasonType,
      reason,
    });

    switch (targetType) {
      case TargetType.POST:
      case TargetType.ARTICLE:
        hideContent(targetId);
        break;

      case TargetType.COMMENT:
      case TargetType.CHILD_COMMENT:
        hideCommnent(targetId, parentCommentId);
        break;

      default:
        break;
    }

    Store.store.dispatch(
      modalActions.showHideToastMessage({ content: 'common:text_report_sent' }),
    );
  } catch (e) {
    console.error('\x1b[31m🐣️ action reportContent error: ', e, '\x1b[0m');
    showError(e);
  }
};

const hideContent = (id: string) => {
  const post = usePostsStore.getState()?.posts?.[id] || {};
  const removePost = {
    ...post,
    reported: true,
  };
  usePostsStore.getState().actions.addToPosts({ data: removePost } as IPayloadAddToAllPost);
};

const hideCommnent = (commentId: string, parentCommentId?: string) => {
  const allComments = useCommentsStore.getState().comments || {};
  const comment: ICommentData = allComments?.[commentId] || {};
  let newCmt = {};

  if (parentCommentId) {
    newCmt = {
      ...comment,
      reported: true,
    };
  } else {
    newCmt = {
      ...comment,
      totalReply: 0,
      child: {
        meta: {},
        list: [],
      },
      reported: true,
    };
  }

  useCommentsStore.getState().actions.addToComments(newCmt);
};

export default reportContent;
