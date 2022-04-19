import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {
  IActivityData,
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
} from '~/interfaces/IPost';
import {ReactionType} from '~/constants/reactions';
import {Platform} from 'react-native';

const provider = ApiConfig.providers.beinFeed;

const DEFAULT_LIMIT = 10;

export const postApiConfig = {
  getPostDetail: (params: IParamGetPostDetail): HttpApiRequestConfig => {
    const {postId, ...restParams} = params;
    return {
      url: `${provider.url}api/v1/posts/${postId}`,
      method: 'get',
      provider,
      useRetry: true,
      params: restParams,
    };
  },
  getDraftPosts: (params: IParamGetDraftPosts): HttpApiRequestConfig => {
    return {
      url: `${provider.url}api/v1/posts/draft`,
      method: 'get',
      provider,
      useRetry: true,
      params: {
        offset: params?.offset || 0,
        limit: params?.limit || 10,
      },
    };
  },
  postCreateNewPost: (data: IPostCreatePost): HttpApiRequestConfig => ({
    url: `${provider.url}api/v1/posts`,
    method: 'post',
    provider,
    useRetry: true,
    data,
  }),
  putReaction: (params: IParamPutReaction): HttpApiRequestConfig => {
    return {
      url: `${provider.url}api/v1/reactions`,
      method: 'post',
      provider,
      useRetry: true,
      data: params,
    };
  },
  putEditPost: (param: IParamPutEditPost): HttpApiRequestConfig => {
    const {postId, data} = param || {};
    return {
      url: `${provider.url}api/v1/posts/${postId}`,
      method: 'put',
      provider,
      useRetry: true,
      data,
    };
  },
  putEditComment: (id: string, data: ICommentData): HttpApiRequestConfig => ({
    url: `${provider.url}api/v1/comments/${id}`,
    method: 'put',
    provider,
    useRetry: true,
    data,
  }),
  deletePost: (id: string, isDraftPost?: boolean): HttpApiRequestConfig => ({
    url: `${provider.url}api/posts/${id}`,
    method: 'delete',
    provider,
    useRetry: true,
    ...(isDraftPost ? {params: {is_draft: true}} : {}),
  }),
  deleteComment: (id: number): HttpApiRequestConfig => ({
    url: `${provider.url}api/v1/comments/${id}`,
    method: 'delete',
    provider,
    useRetry: true,
  }),
  getAudienceGroups: (userId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/${userId}/groups-be-in`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getAudienceUsers: (userId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getCommentsByPostId: (
    params: IRequestGetPostComment,
  ): HttpApiRequestConfig => ({
    url: `${provider.url}api/v1/comments`,
    method: 'get',
    provider,
    useRetry: true,
    params: {
      order: params?.order || 'ASC',
      limit: params?.limit || 10,
      offset: params?.offset || 0,
      idGTE: params?.idGTE,
      idLTE: params?.idLTE,
      idLT: params?.idLT,
      postId: params?.postId,
      parentId: params?.parentId,
      childLimit: params?.childLimit || 1,
    },
  }),
  postNewComment: (params: IRequestPostComment): HttpApiRequestConfig => ({
    url: `${provider.url}api/v1/comments`,
    method: 'post',
    provider,
    useRetry: true,
    data: {
      postId: params?.postId,
      content: params?.data?.content,
      media: params?.data?.media,
      mentions: params?.data?.mentions,
    },
  }),
  postReplyComment: (params: IRequestReplyComment): HttpApiRequestConfig => {
    const {postId, parentCommentId, data} = params;
    return {
      url: `${provider.url}api/v1/comments/${parentCommentId}/reply`,
      method: 'post',
      provider,
      useRetry: true,
      data: {
        postId,
        ...data,
      },
    };
  },
  postMarkAsRead: (postId: string, userId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}reactions/mark-as-read`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      postId: postId,
      userId: userId,
    },
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
      key: params.key,
      offset: params.skip,
      limit: params.take,
    },
  }),
  deleteReaction: (data: IParamDeleteReaction): HttpApiRequestConfig => ({
    url: `${provider.url}api/v1/reactions`,
    method: 'delete',
    provider,
    useRetry: true,
    data: data,
  }),
  getReactionDetail: (
    param: IParamGetReactionDetail,
  ): HttpApiRequestConfig => ({
    url: `${provider.url}api/v1/reactions`,
    method: 'get',
    provider: provider,
    useRetry: true,
    params: {
      reactionName: param.reactionName,
      targetId: param.targetId,
      target: param.target,
      order: param?.order || 'DESC',
      limit: param?.limit || 20,
      latestId: param?.latestId || 0,
    },
  }),
  postPublishDraftPost: (draftPostId: string): HttpApiRequestConfig => ({
    url: `${provider.url}api/v1/posts/${draftPostId}/publish`,
    method: 'put',
    provider: provider,
    useRetry: true,
  }),
};

const postDataHelper = {
  postCreateNewPost: async (data: IPostCreatePost) => {
    console.log(
      `\x1b[34m🐣️ PostDataHelper postCreateNewPost`,
      `${JSON.stringify(data, undefined, 2)}\x1b[0m`,
    );
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
  putEditComment: async (id: string, data: IActivityData) => {
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
  deleteComment: async (id: number) => {
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
  postMarkAsRead: async (postId: string, userId: number) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.postMarkAsRead(postId, userId),
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
          commentLimit: Platform.OS === 'web' ? 5 : 10,
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
        console.log(`\x1b[36m🐣️ PostDataHelper postPublishDraftPost 1\x1b[0m`);
        return Promise.resolve(response?.data);
      } else {
        console.log(`\x1b[36m🐣️ PostDataHelper postPublishDraftPost 2\x1b[0m`);
        return Promise.reject(response);
      }
    } catch (e) {
      console.log(`\x1b[36m🐣️ PostDataHelper postPublishDraftPost 3\x1b[0m`);
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
};

export default postDataHelper;
