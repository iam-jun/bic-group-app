import {StreamClient} from 'getstream';
import {makeGetStreamRequest, makeHttpRequest} from '~/services/httpApiRequest';
import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {
  IParamGetRecentSearchKeywords,
  IParamGetSearchPost,
  IParamPostNewRecentSearchKeyword,
  IRecentSearchTarget,
} from '~/interfaces/IHome';
import apiConfig from '~/configs/apiConfig';
import {IParamsGetUsers} from '~/interfaces/IAppHttpRequest';

const homeApiConfig = {
  getSearchPost: (param: IParamGetSearchPost): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}posts`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      content: param?.content,
      actors: param?.actors,
      start_time: param?.start_time,
      end_time: param?.end_time,
      offset: param?.offset,
      limit: param?.limit,
    },
  }),
  getRecentSearchKeyword: (
    param: IParamGetRecentSearchKeywords,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}recent-searches`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      limit: param?.limit,
      target: param?.target,
      sort: param?.sort,
    },
  }),
  postNewRecentSearchKeyword: (
    data: IParamPostNewRecentSearchKeyword,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}recent-searches`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data,
  }),
  deleteClearRecentSearch: (
    target: IRecentSearchTarget,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}recent-searches/${target}/clean`,
    method: 'delete',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  deleteRecentSearchById: (id: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}recent-searches/${id}/delete`,
    method: 'delete',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
};

const homeDataHelper = {
  getHomePosts: async (
    userId: string,
    streamClient?: StreamClient,
    offset?: number,
  ) => {
    if (streamClient && userId) {
      const streamOptions = {
        offset: offset || 0,
        limit: 15,
        user_id: `${userId}`, //required for CORRECT own_reactions data
        ownReactions: true,
        recentReactionsLimit: 10,
        withOwnReactions: true,
        withOwnChildren: true, //return own_children of reaction to comment
        withRecentReactions: true,
        withReactionCounts: true,
        enrich: true, //extra data for user & group
        ranking: 'important_first', //important posts will on top of results
      };
      try {
        const data = await makeGetStreamRequest(
          streamClient,
          'newsfeed',
          `u-${userId}`,
          'get',
          streamOptions,
        );
        return Promise.resolve(data?.results || []);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject('StreamClient or UserId not found');
  },
  getSearchPost: async (param: IParamGetSearchPost) => {
    try {
      const response: any = await makeHttpRequest(
        homeApiConfig.getSearchPost(param),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getUsers: async (params: IParamsGetUsers) => {
    try {
      const response: any = await makeHttpRequest(
        apiConfig.App.getUsers(params),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getRecentSearchKeywords: async (param: IParamGetRecentSearchKeywords) => {
    try {
      const response: any = await makeHttpRequest(
        homeApiConfig.getRecentSearchKeyword(param),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  postNewRecentSearchKeyword: async (
    param: IParamPostNewRecentSearchKeyword,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        homeApiConfig.postNewRecentSearchKeyword(param),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteCleanRecentSearch: async (target: IRecentSearchTarget) => {
    try {
      const response: any = await makeHttpRequest(
        homeApiConfig.deleteClearRecentSearch(target),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteRecentSearchById: async (id: string) => {
    try {
      const response: any = await makeHttpRequest(
        homeApiConfig.deleteRecentSearchById(id),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default homeDataHelper;
