import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {
  IActivityData,
  IParamGetDraftPosts,
  IParamGetPostAudiences,
  IParamGetPostDetail,
  IParamGetReactionDetail,
  IParamPutEditPost,
  IParamPutReactionToComment,
  IParamPutReactionToPost,
  IParamSearchMentionAudiences,
  IPostCreatePost,
  IRequestGetPostComment,
  IRequestPostComment,
  IRequestReplyComment,
} from '~/interfaces/IPost';
import {ReactionType} from '~/constants/reactions';

const provider = ApiConfig.providers.beinFeed;

export const postApiConfig = {
  getPostDetail: (params: IParamGetPostDetail): HttpApiRequestConfig => {
    const {postId, ...restParams} = params;
    return {
      url: `${provider.url}api/posts/${postId}`,
      method: 'get',
      provider,
      useRetry: true,
      params: restParams,
    };
  },
  getDraftPosts: (params: IParamGetDraftPosts): HttpApiRequestConfig => {
    return {
      url: `${provider.url}api/feeds/draft`,
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
    url: `${provider.url}api/posts`,
    method: 'post',
    provider,
    useRetry: true,
    data,
  }),
  putReactionToPost: (
    params: IParamPutReactionToPost,
  ): HttpApiRequestConfig => {
    const {postId, ...restParams} = params;
    return {
      url: `${provider.url}api/posts/${postId}/react`,
      method: 'put',
      provider,
      useRetry: true,
      data: restParams,
    };
  },
  putEditPost: (param: IParamPutEditPost): HttpApiRequestConfig => {
    const {postId, data} = param || {};
    return {
      url: `${provider.url}api/posts/${postId}`,
      method: 'put',
      provider,
      useRetry: true,
      data,
    };
  },
  putEditComment: (id: string, data: IActivityData): HttpApiRequestConfig => ({
    url: `${provider.url}api/comments/${id}`,
    method: 'put',
    provider,
    useRetry: true,
    data: {data},
  }),
  deletePost: (id: string, isDraftPost?: boolean): HttpApiRequestConfig => ({
    url: `${provider.url}api/posts/${id}`,
    method: 'delete',
    provider,
    useRetry: true,
    ...(isDraftPost ? {params: {is_draft: true}} : {}),
  }),
  deleteComment: (id: string): HttpApiRequestConfig => ({
    url: `${provider.url}api/comments/${id}`,
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
    data: IRequestGetPostComment,
  ): HttpApiRequestConfig => ({
    url: `${provider.url}api/comments`,
    method: 'get',
    provider,
    useRetry: true,
    params: {
      post_id: data?.commentId ? undefined : data?.postId, //accept only one of post_id, reaction_id or user_id
      reaction_id: data?.commentId,
      kind: data?.kind || 'comment',
      id_lt: data?.idLt,
      recent_reactions_limit: data?.recentReactionsLimit || 10,
      recent_child_reactions_limit: data?.recentChildReactionsLimit || 1,
    },
  }),
  postNewComment: (params: IRequestPostComment): HttpApiRequestConfig => ({
    url: `${provider.url}api/comments`,
    method: 'post',
    provider,
    useRetry: true,
    data: {
      post_id: params.postId,
      data: params.data,
    },
  }),
  postReplyComment: (params: IRequestReplyComment): HttpApiRequestConfig => {
    const {parentCommentId, data} = params;
    return {
      url: `${provider.url}api/comments/${parentCommentId}/reply`,
      method: 'post',
      provider,
      useRetry: true,
      data: {
        data,
      },
    };
  },
  putReactionToComment: (
    params: IParamPutReactionToComment,
  ): HttpApiRequestConfig => {
    const {commentId, ...restParams} = params;
    return {
      url: `${provider.url}api/comments/${commentId}/react`,
      method: 'put',
      provider,
      useRetry: true,
      data: restParams,
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
  postReaction: (
    referenceId: string,
    referenceType: 'post' | 'comment',
    data: ReactionType[],
    userId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}reactions/reacts`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      referenceId: referenceId,
      referenceType: referenceType,
      data: data,
      userId: userId,
    },
  }),
  deleteReaction: (id: string): HttpApiRequestConfig => ({
    url: `${provider.url}api/reactions/${id}`,
    method: 'delete',
    provider,
    useRetry: true,
  }),
  getReactionDetail: (
    reactionType: ReactionType,
    postId?: string,
    commentId?: string,
    idLessThan?: string,
    limit?: number,
  ): HttpApiRequestConfig => ({
    url: `${provider.url}api/reactions/statistics`,
    method: 'get',
    provider: provider,
    useRetry: true,
    params: {
      kind: reactionType,
      reaction_id: commentId,
      post_id: commentId ? undefined : postId,
      id_lt: idLessThan,
      limit: limit || 20,
    },
  }),
  postPublishDraftPost: (draftPostId: string): HttpApiRequestConfig => ({
    url: `${provider.url}api/posts/${draftPostId}/publish`,
    method: 'put',
    provider: provider,
    useRetry: true,
  }),
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
  putReactionToPost: async (param: IParamPutReactionToPost) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.putReactionToPost(param),
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
  getCommentsByPostId: async (data: IRequestGetPostComment) => {
    if (!data?.postId) {
      return Promise.reject('Post Id not found');
    }
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getCommentsByPostId(data),
      );
      if (response?.data?.data?.comment) {
        return Promise.resolve({
          results: response?.data?.data?.comment,
        });
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
  putReactionToComment: async (param: IParamPutReactionToComment) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.putReactionToComment(param),
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
  postReaction: async (
    referenceId: string,
    referenceType: 'post' | 'comment',
    data: ReactionType[],
    userId: number,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.postReaction(referenceId, referenceType, data, userId),
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
  deleteReaction: async (id: string) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.deleteReaction(id),
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
    const {reactionType, postId, commentId, idLessThan, limit} = param;
    if (reactionType && (postId || commentId)) {
      try {
        const response: any = await makeHttpRequest(
          postApiConfig.getReactionDetail(
            reactionType,
            postId,
            commentId,
            idLessThan,
            limit,
          ),
        );
        if (response && response?.data) {
          return Promise.resolve(response?.data?.data);
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
          enrich: true,
          own_reactions: true,
          with_own_reactions: true,
          with_own_children: true,
          with_recent_reactions: true,
          with_reaction_counts: true,
          recent_reactions_limit: 10,
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
          data: response?.data?.data?.results || [],
          canLoadMore: !!response?.data?.data?.next,
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
};

export default postDataHelper;
