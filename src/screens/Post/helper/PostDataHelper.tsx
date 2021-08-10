import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {
  IParamSearchMentionAudiences,
  IPostCreatePost,
  IRequestPostComment,
} from '~/interfaces/IPost';
import postDataMocks from '~/screens/Post/helper/PostDataMocks';

export const postApiConfig = {
  postCreateNewPost: (data: IPostCreatePost): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}posts`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data,
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
      skip: params.skip,
      take: params.take,
    },
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
      console.log(
        '\x1b[36m',
        '🐣 postDataHelper | getSearchMentionAudiences : ',
        JSON.stringify(params, undefined, 2),
        '\x1b[0m',
      );
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
};

export default postDataHelper;
