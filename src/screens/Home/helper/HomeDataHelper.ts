import {makeHttpRequest} from '~/services/httpApiRequest';
import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {
  IParamGetFeed,
  IParamGetRecentSearchKeywords,
  IParamGetSearchPost,
  IParamPostNewRecentSearchKeyword,
  IRecentSearchTarget,
} from '~/interfaces/IHome';
import apiConfig from '~/configs/apiConfig';
import {IParamsGetUsers} from '~/interfaces/IAppHttpRequest';

const homeApiConfig = {
  getNewsfeed: (param: IParamGetFeed): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}api/v1/feeds/newsfeed`,
    method: 'get',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
    params: {
      order: param?.order || 'ASC',
      limit: param?.limit,
      offset: param?.offset,
      idGTE: param?.idGTE,
      idLTE: param?.idLTE,
      idGT: param?.idGT,
      idLT: param?.idLT,
    },
  }),
  getSearchPost: (param: IParamGetSearchPost): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}api/posts`,
    method: 'get',
    provider: ApiConfig.providers.beinFeed,
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
    url: `${ApiConfig.providers.beinFeed.url}api/recent-searches`,
    method: 'get',
    provider: ApiConfig.providers.beinFeed,
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
    url: `${ApiConfig.providers.beinFeed.url}api/recent-searches`,
    method: 'post',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
    data,
  }),
  deleteClearRecentSearch: (
    target: IRecentSearchTarget,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}api/recent-searches/${target}/clean`,
    method: 'delete',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
  }),
  deleteRecentSearchById: (id: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}api/recent-searches/${id}/delete`,
    method: 'delete',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
  }),
};

const homeDataHelper = {
  getNewsfeed: async (param: IParamGetFeed) => {
    try {
      const response: any = await makeHttpRequest(
        homeApiConfig.getNewsfeed(param),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data?.list);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
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
