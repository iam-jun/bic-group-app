import { call } from 'redux-saga/effects';

import { IPayloadAddToAllPost, IPayloadRemoveAudiencesOfPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import streamApi from '../../../api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

export default function* removeAudiencesFromPost({
  payload,
}: {
  type: string;
  payload: IPayloadRemoveAudiencesOfPost;
}): any {
  const { id, listAudiences } = payload;
  if (!id || !listAudiences?.length) {
    console.warn('\x1b[31m🐣️ saga removeAudiencesFromPost: id not found or listAudiences is not an array\x1b[0m');
    return;
  }
  try {
    const data = {
      audience: {
        userIds: [],
        groupIds: listAudiences,
      },
    };
    const response = yield call(streamApi.putEditPost, {
      postId: id,
      data,
    });
    if (response?.data) {
      const post = response?.data;
      usePostsStore.getState().actions.addToPosts({ data: post } as IPayloadAddToAllPost);
      showToastSuccess(response);
    }
  } catch (e: any) {
    console.error('\x1b[31m🐣️ saga removeAudiencesFromPost error: ', e, '\x1b[0m');
    showToastError(e);
  }
}
