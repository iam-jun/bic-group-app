import { isEmpty } from 'lodash';
import streamApi from '~/api/StreamApi';
import { getReportContent } from '~/helpers/common';
import { IParamGetArticleDetail, IPayloadGetArticleDetail } from '~/interfaces/IArticle';
import { TargetType } from '~/interfaces/IReport';
import usePostsStore from '~/store/entities/posts';
import { IArticlesState } from '..';

const getArticleDetail = (set, get) => async (payload: IPayloadGetArticleDetail) => {
  const {
    articleId: id, isReported, isAdmin, isLoadComment = false,
  } = payload || {};
  const { requestings }: IArticlesState = get();

  if (requestings[id]) return;

  set((state) => {
    state.requestings[id] = true;
  }, 'requestingGetArticleDetail');

  try {
    let response = null;

    if (isReported) {
      response = await getReportContent({ id, type: TargetType.ARTICLE });
      if (isEmpty(response)) {
        set((state) => {
          delete state.requestings[id];
          state.errors[id] = true;
        }, 'getArticlesReportedError');
        return;
      }
    } else {
      const params = {
        withComment: false,
      } as IParamGetArticleDetail;

      const responeArticleDetail = isAdmin
        ? await streamApi.getArticleDetailByAdmin(id, params)
        : await streamApi.getArticleDetail(id);

      if (isLoadComment) {
        const responseComments = await streamApi.getCommentsByPostId({ postId: id, order: 'DESC' });
        if (responeArticleDetail?.data) {
          response = {
            ...responeArticleDetail.data,
            comments: {
              list: responseComments.data?.list || [],
              meta: responseComments.data?.meta || {},
            },
          };
        }
      } else {
        response = {
          ...responeArticleDetail.data,
          comments: {
            list: [],
            meta: {},
          },
        };
      }
    }

    set((state) => {
      delete state.requestings[id];
    }, 'getArticlesSuccess');

    usePostsStore.getState().actions.addToPosts({ data: response || {}, handleComment: isLoadComment });
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
