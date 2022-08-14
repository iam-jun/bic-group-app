import ApiConfig, { HttpApiRequestConfig } from '~/api/apiConfig';
import { makeHttpRequest, withHttpRequestPromise } from '~/api/apiRequest';
import {
  IParamDeleteReaction,
  ICommentData,
  IParamGetDraftPosts,
  IParamGetPostAudiences,
  IParamGetPostDetail,
  IParamGetReactionDetail,
  IParamPutEditPost,
  IParamPutReaction,
  IParamSearchMentionAudiences,
  IPostCreatePost,
  IRequestGetPostComment,
  IRequestPostComment,
  IRequestReplyComment,
  IRequestGetUsersSeenPost,
} from '~/interfaces/IPost';

const provider = ApiConfig.providers.beinFeed;

const DEFAULT_LIMIT = 10;

export const postApiConfig = {
  getPostDetail: (params: IParamGetPostDetail): HttpApiRequestConfig => {
    const { postId, ...restParams } = params;
    return {
      url: `${provider.url}posts/${postId}`,
      method: 'get',
      provider,
      useRetry: true,
      params: restParams,
    };
  },
  getDraftPosts: (params: IParamGetDraftPosts): HttpApiRequestConfig => ({
    url: `${provider.url}posts/draft`,
    method: 'get',
    provider,
    useRetry: true,
    params: {
      offset: params?.offset || 0,
      limit: params?.limit || 10,
      isProcessing: params?.isProcessing || false,
    },
  }),
  postCreateNewPost: (data: IPostCreatePost): HttpApiRequestConfig => ({
    url: `${provider.url}posts`,
    method: 'post',
    provider,
    useRetry: true,
    data,
  }),
  putReaction: (params: IParamPutReaction): HttpApiRequestConfig => ({
    url: `${provider.url}reactions`,
    method: 'post',
    provider,
    useRetry: true,
    data: {
      ...params,
    },
  }),
  putEditPost: (param: IParamPutEditPost): HttpApiRequestConfig => {
    const { postId, data } = param || {};
    return {
      url: `${provider.url}posts/${postId}`,
      method: 'put',
      provider,
      useRetry: true,
      data,
    };
  },
  putEditComment: (id: string, data: ICommentData): HttpApiRequestConfig => ({
    url: `${provider.url}comments/${id}`,
    method: 'put',
    provider,
    useRetry: true,
    data,
  }),
  deletePost: (id: string, isDraftPost?: boolean): HttpApiRequestConfig => ({
    url: `${provider.url}posts/${id}`,
    method: 'delete',
    provider,
    useRetry: true,
    ...(isDraftPost ? { params: { is_draft: true } } : {}),
  }),
  deleteComment: (id: string): HttpApiRequestConfig => ({
    url: `${provider.url}comments/${id}`,
    method: 'delete',
    provider,
    useRetry: true,
  }),
  getCommentsByPostId: (
    params: IRequestGetPostComment,
  ): HttpApiRequestConfig => ({
    url: `${provider.url}comments`,
    method: 'get',
    provider,
    useRetry: true,
    params: {
      order: params?.order || 'ASC',
      limit: params?.limit || 10,
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
    url: `${provider.url}comments`,
    method: 'post',
    provider,
    useRetry: true,
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
      url: `${provider.url}comments/${parentCommentId}/reply`,
      method: 'post',
      provider,
      useRetry: true,
      data: {
        postId,
        ...data,
      },
    };
  },
  putMarkAsRead: (postId: string): HttpApiRequestConfig => ({
    url: `${provider.url}posts/${postId}/mark-as-read`,
    method: 'put',
    provider,
    useRetry: true,
  }),
  putMarkSeenPost: (postId: string): HttpApiRequestConfig => ({
    url: `${provider.url}feeds/seen/${postId}`,
    method: 'put',
    provider,
    useRetry: true,
  }),
  getSearchAudiences: (key: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}post-audiences`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      key,
    },
  }),
  getPostAudiences: (params: IParamGetPostAudiences): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}/post-audiences/groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  getSearchMentionAudiences: (
    params: IParamSearchMentionAudiences,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/mentionable`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      group_ids: params.groupIds,
      user_ids: params.userIds,
      key: params.key ? params.key : undefined,
      offset: params.skip,
      limit: params.take,
    },
  }),
  deleteReaction: (data: IParamDeleteReaction): HttpApiRequestConfig => ({
    url: `${provider.url}reactions`,
    method: 'delete',
    provider,
    useRetry: true,
    data: {
      ...data,
      reactionName: data?.reactionName,
    },
  }),
  getReactionDetail: (
    param: IParamGetReactionDetail,
  ): HttpApiRequestConfig => ({
    url: `${provider.url}reactions`,
    method: 'get',
    provider,
    useRetry: true,
    params: {
      reactionName: param.reactionName,
      targetId: param.targetId,
      target: param.target,
      order: param?.order || 'ASC',
      limit: param?.limit || 20,
      latestId: param?.latestId,
    },
  }),
  postPublishDraftPost: (draftPostId: string): HttpApiRequestConfig => ({
    url: `${provider.url}posts/${draftPostId}/publish`,
    method: 'put',
    provider,
    useRetry: true,
  }),
  getCommentDetail: (
    commentId: string,
    params: IRequestGetPostComment,
  ): HttpApiRequestConfig => ({
    url: `${provider.url}comments/${commentId}`,
    method: 'get',
    provider,
    useRetry: true,
    params: {
      limit: params?.limit || 1,
      offset: params?.offset || 0,
      postId: params?.postId || '',
    },
  }),
  getUsersSeenPost: (
    params: IRequestGetUsersSeenPost,
  ): HttpApiRequestConfig => ({
    url: `${provider.url}feeds/seen/user`,
    method: 'get',
    provider,
    useRetry: true,
    params: {
      postId: params.postId,
      limit: params?.limit || 20,
      offset: params?.offset || 0,
    },
  }),
};

const streamApi = {
  postCreateNewPost: (data: IPostCreatePost) => withHttpRequestPromise(postApiConfig.postCreateNewPost, data),
  putReaction: (param: IParamPutReaction) => withHttpRequestPromise(postApiConfig.putReaction, param),
  putEditPost: (param: IParamPutEditPost) => withHttpRequestPromise(postApiConfig.putEditPost, param),
  putEditComment: (id: string, data: ICommentData) => withHttpRequestPromise(postApiConfig.putEditComment, id, data),
  deletePost: (id: string, isDraftPost?: boolean) => withHttpRequestPromise(postApiConfig.deletePost, id, isDraftPost),
  deleteComment: (id: string) => withHttpRequestPromise(postApiConfig.deleteComment, id),
  getCommentsByPostId: (params: IRequestGetPostComment) => {
    if (!params?.postId) {
      return Promise.reject(new Error('Post Id not found'));
    }
    return withHttpRequestPromise(postApiConfig.getCommentsByPostId, params)
  },
  postNewComment: (params: IRequestPostComment) => withHttpRequestPromise(postApiConfig.postNewComment, params),
  postReplyComment: (params: IRequestReplyComment) => withHttpRequestPromise(postApiConfig.postReplyComment, params),
  putMarkAsRead: (postId: string) => withHttpRequestPromise(postApiConfig.putMarkAsRead, postId),
  putMarkSeenPost: (postId: string) => withHttpRequestPromise(postApiConfig.putMarkSeenPost, postId),
  getSearchAudiences: (key: string) => withHttpRequestPromise(postApiConfig.getSearchAudiences, key),
  getSearchMentionAudiences: (params: IParamSearchMentionAudiences) => withHttpRequestPromise(
    postApiConfig.getSearchMentionAudiences, params,
  ),
  deleteReaction: (param: IParamDeleteReaction) => withHttpRequestPromise(postApiConfig.deleteReaction, param),
  getReactionDetail: async (param: IParamGetReactionDetail) => {
    const { reactionName, targetId, target } = param;

    if (reactionName && targetId && target) {
      try {
        const response: any = await makeHttpRequest(
          postApiConfig.getReactionDetail(param),
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
      ...params,
    };
    return withHttpRequestPromise(postApiConfig.getPostDetail, requestParams)
  },
  getDraftPosts: async (param: IParamGetDraftPosts) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getDraftPosts(param),
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
  postPublishDraftPost: (draftPostId: string) => withHttpRequestPromise(
    postApiConfig.postPublishDraftPost, draftPostId,
  ),
  getPostAudience: (params: IParamGetPostAudiences) => withHttpRequestPromise(
    postApiConfig.getPostAudiences, params,
  ),
  getCommentDetail: (commentId: string, params: IRequestGetPostComment) => withHttpRequestPromise(
    postApiConfig.getCommentDetail, commentId, params,
  ),
  getSeenList: (params: IRequestGetUsersSeenPost) => withHttpRequestPromise(postApiConfig.getUsersSeenPost, params),
};

export default streamApi;
