import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {
  IParamSearchMentionAudiences,
  IPostCreatePost,
  IRequestPostComment,
} from '~/interfaces/IPost';
import postDataMocks from '~/screens/Post/helper/PostDataMocks';
import {ReactionType} from '~/constants/reactions';

export const postApiConfig = {
  postCreateNewPost: (data: IPostCreatePost): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}posts`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data,
  }),
  putPost: (id: string, data: IPostCreatePost): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}posts/${id}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data,
  }),
  deletePost: (id: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}posts/${id}`,
    method: 'delete',
    provider: ApiConfig.providers.bein,
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
  getPostComment: (postId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}reactions`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      post_id: postId,
      kind: 'comment',
    },
  }),
  postNewComment: (params: IRequestPostComment): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}reactions/comments`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      userId: params.userId,
      referenceId: params.referenceId,
      referenceType: params.referenceType || 'post',
      data: params.commentData,
    },
  }),
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
    url: `${ApiConfig.providers.bein.url}posts/search/audiences`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      key,
    },
  }),
  getSearchMentionAudiences: (
    params: IParamSearchMentionAudiences,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users`,
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
    url: `${ApiConfig.providers.bein.url}reactions/${id}`,
    method: 'delete',
    provider: ApiConfig.providers.bein,
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

  putEditPost: async (id: string, data: IPostCreatePost) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.putPost(id, data),
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
  deletePost: async (id: string) => {
    try {
      const response: any = await makeHttpRequest(postApiConfig.deletePost(id));
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getAudienceGroups: async (userId: number) => {
    return Promise.resolve(postDataMocks.getGroups);
    return;

    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getAudienceGroups(userId),
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
  getAudienceUsers: async (userId: number) => {
    return Promise.resolve(postDataMocks.getUsers);
    return;

    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getAudienceUsers(userId),
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
  getPostComment: async (postId: string) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.getPostComment(postId),
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
  postNewComment: async (params: IRequestPostComment) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.postNewComment(params),
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
};

export default postDataHelper;
