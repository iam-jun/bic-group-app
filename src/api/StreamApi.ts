import { Method } from 'axios';
import { apiProviders, apiVersionId, HttpApiRequestConfig } from '~/api/apiConfig';
import { makeHttpRequest, withHttpRequestPromise } from '~/api/apiRequest';
import {
  IParamDeleteReaction,
  ICommentData,
  IParamGetDraftContents,
  IParamGetPostAudiences,
  IParamGetPostDetail,
  IParamGetReactionDetail,
  IParamPutReaction,
  IParamSearchMentionAudiences,
  IPostCreatePost,
  IRequestGetPostComment,
  IRequestPostComment,
  IRequestReplyComment,
  IRequestGetUsersInterestedPost,
  IParamsGetPostByParams,
  IParamUpdatePost,
} from '~/interfaces/IPost';
import {
  IParamGetFeed,
  IParamGetRecentSearchKeywords,
  IParamGetSearchPost,
  IParamPostNewRecentSearchKeyword, IRecentSearchTarget,
} from '~/interfaces/IHome';
import { IParamGetGroupPosts } from '~/interfaces/IGroup';
import {
  IGetSearchArticleInSeries,
  IGetSearchTags,
  IParamGetArticleDetail,
  IParamGetArticles,
  IParamGetCategories,
  IParamPutEditArticle,
  IParamsGetArticleScheduleContent,
  IParamsValidateSeriesTags,
} from '~/interfaces/IArticle';
import appConfig from '~/configs/appConfig';
import { IGetGiphyTrendingParams, IGetSearchGiphyParams } from '~/interfaces/IGiphy';
import {
  IAddArticleInSeries,
  IGetSeries, IParamGetSeriesDetail, IPostCreateSeries, IReorderItems, IRemoveItemInSeries,
} from '~/interfaces/ISeries';
import { IParamGetReportContent, IParamsReportContent } from '~/interfaces/IReport';
import { CreateTag, EditTag, IParamGetCommunityTags } from '~/interfaces/ITag';

const DEFAULT_LIMIT = 10;

const provider = apiProviders.beinFeed;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
  headers: {
    'x-version-id': apiVersionId.content,
  },
};

export const streamApiConfig = {
  getGiphyAPIKey: (params?: IParamGetGroupPosts): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}authorization/giphy-key`,
    params,
  }),
  getNewsfeed: (param: IParamGetFeed): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}feeds/newsfeed`,
    params: {
      order: param?.order || 'DESC',
      limit: param?.limit,
      offset: param?.offset,
      idGte: param?.idGte,
      idLte: param?.idLte,
      idGt: param?.idGt,
      idLt: param?.idLt,
      isImportant: param?.isImportant,
      isSaved: param?.isSaved,
      isMine: param?.isMine,
      type: param?.type,
    },
  }),
  getSearchPost: (param: IParamGetSearchPost): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}posts`,
    params: { ...param },
  }),
  getRecentSearchKeyword: (param: IParamGetRecentSearchKeywords): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}recent-searches`,
    params: { ...param },
  }),
  postNewRecentSearchKeyword: (data: IParamPostNewRecentSearchKeyword): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}recent-searches`,
    method: 'post',
    data,
  }),
  deleteClearRecentSearch: (target: IRecentSearchTarget): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}recent-searches/${target}/clean`,
    method: 'delete',
  }),
  deleteRecentSearchById: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}recent-searches/${id}/delete`,
    method: 'delete',
  }),
  getPostDetail: (params: IParamGetPostDetail): HttpApiRequestConfig => {
    const { postId, ...restParams } = params;
    return {
      ...defaultConfig,
      url: `${provider.url}posts/${postId}`,
      params: restParams,
    };
  },
  getDraftContents: (params: IParamGetDraftContents): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}content/draft`,
    params: {
      offset: params?.offset || 0,
      limit: params?.limit || 10,
      isProcessing: params?.isProcessing || false,
      type: params?.type,
    },
  }),
  postCreateNewPost: (data: IPostCreatePost): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}posts`,
    method: 'post',
    data,

  }),
  putReaction: (params: IParamPutReaction): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}reactions`,
    method: 'post',
    data: {
      ...params,
    },
  }),
  createArticle: () : HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles`,
    method: 'post',
  }),
  putEditArticle: (articleId: string, param: IParamPutEditArticle): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles/${articleId}`,
    method: 'put',
    data: param,
  }),
  putPublishPost: (param: IParamUpdatePost): HttpApiRequestConfig => {
    const { postId, data } = param || {};
    return {
      ...defaultConfig,
      url: `${provider.url}posts/${postId}/publish`,
      method: 'put',
      data,
    };
  },
  putEditPost: (param: IParamUpdatePost): HttpApiRequestConfig => {
    const { postId, data } = param || {};
    return {
      ...defaultConfig,
      url: `${provider.url}posts/${postId}`,
      method: 'put',
      data,
    };
  },
  putAutoSavePost: (param: IParamUpdatePost): HttpApiRequestConfig => {
    const { postId, data } = param || {};
    return {
      ...defaultConfig,
      url: `${provider.url}posts/${postId}`,
      method: 'patch',
      data,
    };
  },
  putEditComment: (id: string, data: ICommentData): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}comments/${id}`,
    method: 'put',
    data,
  }),
  deletePost: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}posts/${id}`,
    method: 'delete',
  }),
  deleteComment: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}comments/${id}`,
    method: 'delete',
  }),
  getCommentsByPostId: (
    params: IRequestGetPostComment,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}comments`,
    params: {
      order: params?.order || 'ASC',
      limit: params?.limit || appConfig.commentLimit,
      offset: params?.offset || 0,
      idGte: params?.idGte,
      idLte: params?.idLte,
      idLt: params?.idLt,
      idGt: params?.idGt,
      postId: params?.postId,
      parentId: params?.parentId,
      childLimit: params?.childLimit || 1,
    },
  }),
  postNewComment: (params: IRequestPostComment): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}comments`,
    method: 'post',
    data: {
      postId: params?.postId,
      content: params?.data?.content,
      media: params?.data?.media,
      giphy: params?.data?.giphy,
      mentions: params?.data?.mentions,
    },
  }),
  postReplyComment: (params: IRequestReplyComment): HttpApiRequestConfig => {
    const { postId, parentCommentId, data } = params;
    return {
      ...defaultConfig,
      url: `${provider.url}comments/${parentCommentId}/reply`,
      method: 'post',
      data: {
        postId,
        ...data,
      },
    };
  },
  putMarkAsRead: (postId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}posts/${postId}/mark-as-read`,
    method: 'put',
  }),
  putMarkSeenContent: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}content/seen/${id}`,
    method: 'put',
  }),

  // todo move to group
  getPostAudiences: (params: IParamGetPostAudiences): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${apiProviders.bein.url}/post-audiences/groups`,
    provider: apiProviders.bein,
    params,
  }),
  getSearchMentionAudiences: (
    params: IParamSearchMentionAudiences,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${apiProviders.bein.url}users/mentionable`,
    provider: apiProviders.bein,
    params: {
      ...params,
      key: params.key ? params.key : undefined,
    },
  }),

  deleteReaction: (data: IParamDeleteReaction): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}reactions`,
    method: 'delete',
    data: {
      ...data,
      reactionName: data?.reactionName,
    },
  }),
  getReactionDetail: (
    param: IParamGetReactionDetail,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}reactions`,
    params: {
      reactionName: param.reactionName,
      targetId: param.targetId,
      target: param.target,
      order: param?.order || 'ASC',
      limit: param?.limit || 20,
      latestId: param?.latestId,
    },
  }),
  getCommentDetail: (
    commentId: string,
    params: IRequestGetPostComment,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}comments/${commentId}`,
    params: {
      limit: params?.limit || 1,
      offset: params?.offset || 0,
      postId: params?.postId || '',
      childLimit: params?.childLimit || 1,
      targetChildLimit: params?.targetChildLimit || 10,
    },
  }),
  getUsersInterestedPost: (
    params: IRequestGetUsersInterestedPost,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}feeds/seen/user`,
    params: {
      postId: params.postId,
      limit: params?.limit || 20,
      offset: params?.offset || 0,
    },
  }),
  getCategories: (params: IParamGetCategories): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}category`,
    params,
  }),
  getArticles: (
    params: IParamGetArticles,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles`,
    params,
  }),
  getArticleDetail: (
    id: string, params?: IParamGetArticleDetail,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles/${id}`,
    params: {
      ...params,
      childCommentLimit: params?.childCommentLimit || 10,
    },
  }),
  getArticleDetailByAdmin: (
    id: string, params?: IParamGetArticleDetail,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}admin/posts/${id}`,
    params,
  }),
  getGiphyTrending: (
    params: IGetGiphyTrendingParams,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}giphy/trending`,
    params,
  }),
  getSearchGiphy: (
    params: IGetSearchGiphyParams,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}giphy/search`,
    params,
  }),
  postCreateNewSeries: (
    params: IPostCreateSeries,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    method: 'post',
    url: `${provider.url}series`,
    data: { ...params },
  }),
  getSeriesDetail: (id: string,
    params?: IParamGetSeriesDetail): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}series/${id}`,
    params,
  }),
  deleteSeries: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}series/${id}`,
    method: 'delete',
  }),
  editSeries: (id: string, data: IPostCreateSeries): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}series/${id}`,
    method: 'put',
    data,
  }),
  reorderItemsInSeries: (id: string, data: IReorderItems): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}series/${id}/reorder`,
    method: 'put',
    data,
  }),
  searchSeries: (params?: IGetSeries): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}series`,
    params,
  }),
  publishDraftArticle: (draftArticleId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles/${draftArticleId}/publish`,
    method: 'put',
  }),
  scheduleArticle: (draftArticleId: string, publishedAt: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles/${draftArticleId}/schedule`,
    method: 'put',
    data: {
      publishedAt,
    },
  }),
  deleteArticle: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles/${id}`,
    method: 'delete',
  }),
  getTotalDraft: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}posts/total-draft`,
  }),
  postSaveContent: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    method: 'post',
    url: `${provider.url}content/${id}/save`,
  }),
  postUnsaveContent: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}content/${id}/unsave`,
    method: 'delete',
  }),
  getTopicDetail: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}category/${id}`,
    method: 'get',
  }),
  getArticleTopicDetail: (params: any): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles?category_ids[]=${params?.id}`,
    params: {
      offset: params?.offset || 0,
      limit: params?.limit || 10,
      isProcessing: params?.isProcessing || false,
    },
  }),
  searchArticleInSeries: (params: IGetSearchArticleInSeries): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles`,
    params: {
      ...params,
    },
  }),
  addArticleInSeries: (id: string, data: IAddArticleInSeries): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}series/${id}/add-items`,
    method: 'put',
    data,
  }),
  removeItemFromSeriesDetail: (id: string, params: IRemoveItemInSeries): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}series/${id}/remove-items`,
    method: 'delete',
    data: { ...params },
  }),
  reportContent: (params: IParamsReportContent): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}reports/content`,
    method: 'post',
    data: { ...params },
  }),
  searchTagsInAudiences: (params?: IGetSearchTags): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}tags`,
    params,
  }),
  validateSeriesTagsOfArticle: (params: IParamsValidateSeriesTags): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles/validate-series-tags`,
    method: 'post',
    data: { ...params },
  }),
  getTags: (params: IParamGetCommunityTags): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}tags`,
    params: {
      ...params,
    },
  }),
  addTag: (tag: CreateTag): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}tags`,
    method: 'post',
    data: { ...tag },
  }),
  editTag: (tag: EditTag): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}tags/${tag.id}`,
    method: 'put',
    data: { name: tag.name },
  }),
  deleteTag: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}tags/${id}`,
    method: 'delete',
  }),
  getPostByParams: (params: IParamsGetPostByParams): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}posts/params`,
    params: {
      status: params?.status,
      offset: params?.offset || 0,
      limit: params?.limit || 10,
    },
  }),
  getArticleByParams: (params: IParamsGetPostByParams): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}articles/params`,
    params: {
      order: 'ASC',
      ...params,
    },
  }),
  getReportContent: (params: IParamGetReportContent): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}reports/me/content`,
    params: {
      ...params,
    },
  }),
  getArticleScheduleContent: (params: IParamsGetArticleScheduleContent): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}admin/posts/params`,
    params: {
      order: 'ASC',
      limit: params?.limit || DEFAULT_LIMIT,
      ...params,
    },
  }),
  updatePinContent: (postId: string, pinGroupIds: string[], unpinGroupIds: string[]): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}content/${postId}/pin`,
    method: 'put',
    data: { pinGroupIds, unpinGroupIds },
  }),
  getPinnableAudiences: (postId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}content/${postId}/audience`,
    params: {
      pinnable: true,
    },
  }),
  getPinContentsGroup: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}feeds/group/${id}/pinned`,
  }),
  reorderPinContentGroup: (reorderedPinContent: string[], groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}content/group/${groupId}/reorder`,
    method: 'post',
    data: reorderedPinContent,
  }),
};

const streamApi = {
  getGiphyAPIKey: (params?: any) => withHttpRequestPromise(streamApiConfig.getGiphyAPIKey, params),
  getNewsfeed: async (param: IParamGetFeed) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.getNewsfeed(param));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getSearchPost: async (param: IParamGetSearchPost) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.getSearchPost(param));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getRecentSearchKeywords: async (param: IParamGetRecentSearchKeywords) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.getRecentSearchKeyword(param));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  postNewRecentSearchKeyword: async (param: IParamPostNewRecentSearchKeyword) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.postNewRecentSearchKeyword(param));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteCleanRecentSearch: async (target: IRecentSearchTarget) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.deleteClearRecentSearch(target));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteRecentSearchById: async (id: string) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.deleteRecentSearchById(id));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  postCreateNewPost: (data: IPostCreatePost) => withHttpRequestPromise(streamApiConfig.postCreateNewPost, data),
  putReaction: (param: IParamPutReaction) => withHttpRequestPromise(streamApiConfig.putReaction, param),
  createArticle: () => withHttpRequestPromise(streamApiConfig.createArticle),
  putEditArticle: (articleId: string, param: IParamPutEditArticle) => withHttpRequestPromise(
    streamApiConfig.putEditArticle, articleId, param,
  ),
  putPublishPost: (param: IParamUpdatePost) => withHttpRequestPromise(streamApiConfig.putPublishPost, param),
  putEditPost: (param: IParamUpdatePost) => withHttpRequestPromise(streamApiConfig.putEditPost, param),
  putAutoSavePost: (param: IParamUpdatePost) => withHttpRequestPromise(streamApiConfig.putAutoSavePost, param),
  putEditComment: (id: string, data: ICommentData) => withHttpRequestPromise(streamApiConfig.putEditComment, id, data),
  deletePost: (id: string) => withHttpRequestPromise(
    streamApiConfig.deletePost, id,
  ),
  deleteComment: (id: string) => withHttpRequestPromise(streamApiConfig.deleteComment, id),
  getCommentsByPostId: (params: IRequestGetPostComment) => {
    if (!params?.postId) {
      return Promise.reject(new Error('Post Id not found'));
    }
    return withHttpRequestPromise(streamApiConfig.getCommentsByPostId, params);
  },
  postNewComment: (params: IRequestPostComment) => withHttpRequestPromise(streamApiConfig.postNewComment, params),
  postReplyComment: (params: IRequestReplyComment) => withHttpRequestPromise(streamApiConfig.postReplyComment, params),
  putMarkAsRead: (postId: string) => withHttpRequestPromise(streamApiConfig.putMarkAsRead, postId),
  putMarkSeenContent: (id: string) => withHttpRequestPromise(streamApiConfig.putMarkSeenContent, id),
  getSearchMentionAudiences: (params: IParamSearchMentionAudiences) => withHttpRequestPromise(
    streamApiConfig.getSearchMentionAudiences, params,
  ),
  deleteReaction: (param: IParamDeleteReaction) => withHttpRequestPromise(streamApiConfig.deleteReaction, param),
  getReactionDetail: async (param: IParamGetReactionDetail) => {
    const { reactionName, targetId, target } = param;

    if (reactionName && targetId && target) {
      try {
        const response: any = await makeHttpRequest(
          streamApiConfig.getReactionDetail(param),
        );
        if (response && response?.data?.data?.list) {
          return Promise.resolve(response.data.data);
        }
        return Promise.reject(response);
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject(new Error('Invalid param'));
    }
  },

  getPostDetail: (params: IParamGetPostDetail) => {
    const requestParams = {
      commentLimit: 10,
      withComment: true,
      childCommentLimit: 10,
      ...params,
    };
    return withHttpRequestPromise(streamApiConfig.getPostDetail, requestParams);
  },
  getDraftContents: async (param: IParamGetDraftContents) => {
    try {
      const response: any = await makeHttpRequest(
        streamApiConfig.getDraftContents(param),
      );
      if (response && response?.data?.data) {
        return Promise.resolve({
          data: response?.data?.data?.list || [],
          canLoadMore:
            (param?.offset || 0) + (param?.limit || DEFAULT_LIMIT)
            <= response?.data?.data?.meta?.total,
          total: response?.data?.data?.meta?.total,
        });
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getPostAudience: (params: IParamGetPostAudiences) => withHttpRequestPromise(
    streamApiConfig.getPostAudiences, params,
  ),
  getCommentDetail: (commentId: string, params: IRequestGetPostComment) => withHttpRequestPromise(
    streamApiConfig.getCommentDetail, commentId, params,
  ),
  getCategories: (params: IParamGetCategories) => withHttpRequestPromise(
    streamApiConfig.getCategories, params,
  ),
  getArticles: (params: IParamGetArticles) => withHttpRequestPromise(
    streamApiConfig.getArticles, params,
  ),
  getArticleDetail: (id: string, params?: IParamGetArticleDetail) => withHttpRequestPromise(
    streamApiConfig.getArticleDetail, id, params,
  ),
  getArticleDetailByAdmin: (id: string, params?: IParamGetArticleDetail) => withHttpRequestPromise(
    streamApiConfig.getArticleDetailByAdmin, id, params,
  ),
  publishDraftArticle: (draftArticleId: string) => withHttpRequestPromise(
    streamApiConfig.publishDraftArticle, draftArticleId,
  ),
  scheduleArticle: (draftArticleId: string, publishedAt: string) => withHttpRequestPromise(
    streamApiConfig.scheduleArticle, draftArticleId, publishedAt,
  ),
  deleteArticle: (id: string) => withHttpRequestPromise(
    streamApiConfig.deleteArticle, id,
  ),
  getUsersInterestedPost: (params: IRequestGetUsersInterestedPost) => withHttpRequestPromise(
    streamApiConfig.getUsersInterestedPost, params,
  ),
  getGiphyTrending: (params?: IGetGiphyTrendingParams) => withHttpRequestPromise(
    streamApiConfig.getGiphyTrending, params,
  ),
  getSearchGiphy: (params: IGetSearchGiphyParams) => withHttpRequestPromise(
    streamApiConfig.getSearchGiphy, params,
  ),
  postCreateNewSeries: (params: IPostCreateSeries) => withHttpRequestPromise(
    streamApiConfig.postCreateNewSeries, params,
  ),
  getSeriesDetail: (id: string, params?: IParamGetSeriesDetail) => withHttpRequestPromise(
    streamApiConfig.getSeriesDetail, id, params,
  ),
  deleteSeries: (id: string) => withHttpRequestPromise(streamApiConfig.deleteSeries, id),
  editSeries: (id: string, params: IPostCreateSeries) => withHttpRequestPromise(
    streamApiConfig.editSeries, id, params,
  ),
  getTotalDraft: () => withHttpRequestPromise(streamApiConfig.getTotalDraft),
  searchSeries: (params?: IGetSeries) => withHttpRequestPromise(streamApiConfig.searchSeries, params),
  postSaveContent: (id: string) => withHttpRequestPromise(streamApiConfig.postSaveContent, id),
  postUnsaveContent: (id: string) => withHttpRequestPromise(streamApiConfig.postUnsaveContent, id),
  reorderItemsInSeries: (id: string, data: IReorderItems) => withHttpRequestPromise(
    streamApiConfig.reorderItemsInSeries, id, data,
  ),
  getTopicDetail: (id: string) => withHttpRequestPromise(streamApiConfig.getTopicDetail, id),
  getArticleTopicDetail: async (params: any) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.getArticleTopicDetail(params));

      if (response && response?.data?.data) {
        return Promise.resolve({
          data: response?.data?.data?.list || [],
          canLoadMore: (params?.offset || 0) + (params?.limit || DEFAULT_LIMIT)
            <= response?.data?.data?.meta?.total,
          total: response?.data?.data?.meta?.total,
        });
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  searchArticleInSeries: (params: IGetSearchArticleInSeries) => withHttpRequestPromise(
    streamApiConfig.searchArticleInSeries, params,
  ),
  addArticleInSeries: async (id: string, data: IAddArticleInSeries) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.addArticleInSeries(id, data));
      if (response && response?.data) {
        return Promise.resolve(true);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  removeItemFromSeriesDetail: async (id: string, params: IRemoveItemInSeries) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.removeItemFromSeriesDetail(id, params));
      if (response && response?.data) {
        return Promise.resolve(true);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  reportContent: (params: IParamsReportContent) => withHttpRequestPromise(streamApiConfig.reportContent, params),
  searchTagsInAudiences: (params?: IGetSearchTags) => withHttpRequestPromise(
    streamApiConfig.searchTagsInAudiences, params,
  ),
  validateSeriesTagsOfArticle: (params: IParamsValidateSeriesTags) => withHttpRequestPromise(
    streamApiConfig.validateSeriesTagsOfArticle, params,
  ),
  getTags: (params: IParamGetCommunityTags) => withHttpRequestPromise(
    streamApiConfig.getTags, params,
  ),
  addTag: (tag: CreateTag) => withHttpRequestPromise(
    streamApiConfig.addTag, tag,
  ),
  editTag: (tag: EditTag) => withHttpRequestPromise(
    streamApiConfig.editTag, tag,
  ),
  deleteTag: (id: string) => withHttpRequestPromise(
    streamApiConfig.deleteTag, id,
  ),
  getPostByParams: async (params: IParamsGetPostByParams) => {
    try {
      const response: any = await makeHttpRequest(streamApiConfig.getPostByParams(params));
      if (response && response?.data?.data) {
        return Promise.resolve({
          data: response.data.data?.list || [],
          canLoadMore: (params?.offset || 0) + (params?.limit || DEFAULT_LIMIT)
            <= response.data.data?.meta?.total,
          total: response.data.data?.meta?.total,
        });
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getArticleByParams: async (params: IParamsGetPostByParams) => withHttpRequestPromise(
    streamApiConfig.getArticleByParams, params,
  ),
  getReportContent: (params: IParamGetReportContent) => withHttpRequestPromise(
    streamApiConfig.getReportContent, params,
  ),
  getArticleScheduleContent: async (params: IParamsGetArticleScheduleContent) => withHttpRequestPromise(
    streamApiConfig.getArticleScheduleContent, params,
  ),
  updatePinContent: (postId: string, pinGroupIds: string[], unpinGroupIds: string[]) => withHttpRequestPromise(
    streamApiConfig.updatePinContent, postId, pinGroupIds, unpinGroupIds,
  ),
  getPinnableAudiences: (postId: string) => withHttpRequestPromise(
    streamApiConfig.getPinnableAudiences, postId,
  ),
  getPinContentsGroup: (id: string) => withHttpRequestPromise(streamApiConfig.getPinContentsGroup, id),
  reorderPinContentGroup: (reorderedPinContent: string[], groupId: string) => withHttpRequestPromise(
    streamApiConfig.reorderPinContentGroup, reorderedPinContent, groupId,
  ),
};

export default streamApi;
