import streamApi from '~/api/StreamApi';
import { getReportContent } from '~/helpers/common';
import { IParamGetArticleDetail } from '~/interfaces/IArticle';
import { TargetType } from '~/interfaces/IReport';
import usePostsStore from '~/store/entities/posts';
import { IArticlesState } from '..';

const getArticleDetail = (set, get) => async (id: string, isReported?: boolean) => {
  const { requestings }: IArticlesState = get();

  if (requestings[id]) return;

  set((state) => {
    state.requestings[id] = true;
  }, 'requestingGetArticleDetail');

  try {
    const params = { withComment: true, commentLimit: 10 } as IParamGetArticleDetail;

    let response = null;

    if (isReported) {
      response = await getReportContent({ id, type: TargetType.ARTICLE });
    } else {
      const responeArticleDetail = await streamApi.getArticleDetail(id, params);
      if (responeArticleDetail?.data) {
        response = responeArticleDetail.data;
      }
    }

    set((state) => {
      delete state.requestings[id];
      state.errors[id] = false;
    }, 'getArticlesSuccess');

    usePostsStore.getState().actions.addToPosts({ data: response || {}, handleComment: true });
  } catch (error) {
    set((state) => {
      delete state.requestings[id];
      state.errors[id] = true;
    }, 'getArticlesError');
    console.error('getArticleDetail', error);
  }
};

export default getArticleDetail;
