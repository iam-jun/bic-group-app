import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
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
    const {postId, ...restParams} = params;
    return {
      url: `${provider.url}posts/${postId}`,
      method: 'get',
      provider,
      useRetry: true,
      params: restParams,
    };
  },
  getDraftPosts: (params: IParamGetDraftPosts): HttpApiRequestConfig => {
    return {
      url: `${provider.url}posts/draft`,
      method: 'get',
      provider,
      useRetry: true,
      params: {
        offset: params?.offset || 0,
        limit: params?.limit || 10,
        isProcessing: params?.isProcessing || false,
      },
    };
  },
  postCreateNewPost: (data: IPostCreatePost): HttpApiRequestConfig => ({
    url: `${provider.url}posts`,
    method: 'post',
    provider,
    useRetry: true,
    data,
  }),
  putReaction: (params: IParamPutReaction): HttpApiRequestConfig => {
    return {
      url: `${provider.url}reactions`,
      method: 'post',
      provider,
      useRetry: true,
      data: {
        ...params,
      },
    };
  },
  putEditPost: (param: IParamPutEditPost): HttpApiRequestConfig => {
    const {postId, data} = param || {};
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
    ...(isDraftPost ? {params: {is_draft: true}} : {}),
  }),
  deleteComment: (id: string): HttpApiRequestConfig => ({
    url: `${provider.url}comments/${id}`,
    method: 'delete',
    provider,
    useRetry: true,
  }),
  getAudienceGroups: (userId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/${userId}/groups-be-in`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getAudienceUsers: (userId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users`,
    method: 'get',
    provider: ApiConfig.providers.bein,
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
    const {postId, parentCommentId, data} = params;
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
    url: `${ApiConfig.providers.beinFeed.url}posts/${postId}/mark-as-read`,
    method: 'put',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
  }),
  putMarkSeenPost: (postId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}feeds/seen/${postId}`,
    method: 'put',
    provider: ApiConfig.providers.beinFeed,
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
    url: `${ApiConfig.providers.bein.url}post-audiences`,
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
      group_ids: params.group_ids,
      user_ids: params.user_ids,
      key: !!params.key ? params.key : undefined,
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
    provider: provider,
    useRetry: true,
    params: {
      reactionName: param.reactionName,
      targetId: param.targetId,
      target: param.target,
      order: param?.order || 'DESC',
      limit: param?.limit || 20,
      latestId: param?.latestId,
    },
  }),
  postPublishDraftPost: (draftPostId: string): HttpApiRequestConfig => ({
    url: `${provider.url}posts/${draftPostId}/publish`,
    method: 'put',
    provider: provider,
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
  ): HttpApiRequestConfig => {
    // const {postId, ...restParams} = params;
    return {
      url: `${provider.url}feeds/seen/user`,
      method: 'get',
      provider,
      useRetry: true,
      params: {
        postId: params.postId,
        limit: params?.limit || 20,
        offset: params?.offset || 0,
      },
    };
  },
};

const postDataHelper = {
  postCreateNewPost: async (data: IPostCreatePost) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.postCreateNewPost(data),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  putReaction: async (param: IParamPutReaction) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.putReaction(param),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  putEditPost: async (param: IParamPutEditPost) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.putEditPost(param),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  putEditComment: async (id: string, data: ICommentData) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.putEditComment(id, data),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deletePost: async (id: string, isDraftPost?: boolean) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.deletePost(id, isDraftPost),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteComment: async (id: string) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.deleteComment(id),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getCommentsByPostId: async (params: IRequestGetPostComment) => {
    if (!params?.postId) {
      return Promise.reject('Post Id not found');
    }
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getCommentsByPostId(params),
      );
      if (response?.data?.data?.list) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  postNewComment: async (params: IRequestPostComment) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.postNewComment(params),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  postReplyComment: async (params: IRequestReplyComment) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.postReplyComment(params),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  putMarkAsRead: async (postId: string) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.putMarkAsRead(postId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  putMarkSeenPost: async (postId: string) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.putMarkSeenPost(postId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getSearchAudiences: async (key: string) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getSearchAudiences(key),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getSearchMentionAudiences: async (params: IParamSearchMentionAudiences) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getSearchMentionAudiences(params),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteReaction: async (param: IParamDeleteReaction) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.deleteReaction(param),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getReactionDetail: async (param: IParamGetReactionDetail) => {
    const {reactionName, targetId, target} = param;
    if (reactionName && targetId && target) {
      try {
        const response: any = await makeHttpRequest(
          postApiConfig.getReactionDetail(param),
        );
        if (response && response?.data?.data?.list) {
          return Promise.resolve(response.data.data);
        } else {
          return Promise.reject(response);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject('Invalid param');
    }
  },

  getPostDetail: async (params: IParamGetPostDetail) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getPostDetail({
          commentLimit: 10,
          withComment: true,
          ...params,
        }),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
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
            (param?.offset || 0) + (param?.limit || DEFAULT_LIMIT) <=
            response?.data?.data?.meta?.total,
          total: response?.data?.data?.meta?.total,
        });
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  postPublishDraftPost: async (draftPostId: string) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.postPublishDraftPost(draftPostId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getPostAudience: async (params: IParamGetPostAudiences) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getPostAudiences(params),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getCommentDetail: async (
    commentId: string,
    params: IRequestGetPostComment,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getCommentDetail(commentId, params),
      );
      if (response && response?.data && response.data?.data) {
        return Promise.resolve(response.data.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getSeenList: async (params: IRequestGetUsersSeenPost) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getUsersSeenPost({
          ...params,
        }),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default postDataHelper;
