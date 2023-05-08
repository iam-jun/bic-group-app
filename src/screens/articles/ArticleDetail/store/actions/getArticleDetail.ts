import streamApi from '~/api/StreamApi';
import { getReportContent } from '~/helpers/common';
import { IParamGetArticleDetail, IPayloadGetArticleDetail } from '~/interfaces/IArticle';
import { TargetType } from '~/interfaces/IReport';
import usePostsStore from '~/store/entities/posts';
import { IArticlesState } from '..';

const getArticleDetail = (set, get) => async (payload: IPayloadGetArticleDetail) => {
  const { articleId: id, isReported, isAdmin } = payload || {};
  const { requestings }: IArticlesState = get();

  if (requestings[id]) return;

  set((state) => {
    state.requestings[id] = true;
  }, 'requestingGetArticleDetail');

  try {
    let response = null;

    if (isReported) {
      response = await getReportContent({ id, type: TargetType.ARTICLE });
    } else {
      const params = {
        withComment: !isAdmin,
        ...(!isAdmin && { commentLimit: 10 }),
      } as IParamGetArticleDetail;

      const responeArticleDetail = isAdmin
        ? await streamApi.getArticleDetailByAdmin(id, params)
        : await streamApi.getArticleDetail(id, params);

      if (responeArticleDetail?.data) {
        response = responeArticleDetail.data;
      }
    }

    set((state) => {
      delete state.requestings[id];
    }, 'getArticlesSuccess');

    usePostsStore.getState().actions.addToPosts({ data: response || {}, handleComment: true });
    usePostsStore.getState().actions.addToErrorContents(id, { isError: false });
  } catch (error) {
    usePostsStore.getState().actions.addToErrorContents(id, {
      isError: true,
      code: error?.code,
      message: error?.meta?.message || '',
      requireGroups: error?.meta?.errors?.requireGroups || [],
    });

    set((state) => {
      delete state.requestings[id];
    }, 'getArticlesError');

    console.error('getArticleDetail', error);
  }
};

export default getArticleDetail;
