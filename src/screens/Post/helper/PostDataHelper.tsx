import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {IPostCreatePost} from '~/interfaces/IPost';
import postDataMocks from '~/screens/Post/helper/PostDataMocks';

export const postApiConfig = {
  postCreateNewPost: (data: IPostCreatePost): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}api/v1/activitys/posts`,
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
};

export default postDataHelper;
