import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {IActivityData, IPostCreatePost} from '~/interfaces/IPost';
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
  postNewComment: (
    postId: string,
    commentData: IActivityData,
    userId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}reactions/comments`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      userId: userId,
      referenceId: postId,
      referenceType: 'post',
      data: commentData,
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
  postNewComment: async (
    postId: string,
    commentData: IActivityData,
    userId: number,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        postApiConfig.postNewComment(postId, commentData, userId),
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
