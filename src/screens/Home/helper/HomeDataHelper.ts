import { makeHttpRequest } from '~/services/httpApiRequest';
import ApiConfig, { HttpApiRequestConfig } from '~/configs/apiConfig';
import {
  IParamGetFeed,
  IParamGetRecentSearchKeywords,
  IParamGetSearchPost,
  IParamPostNewRecentSearchKeyword,
  IRecentSearchTarget,
} from '~/interfaces/IHome';
import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';

const homeApiConfig = {
  getNewsfeed: (param: IParamGetFeed): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}feeds/newsfeed`,
    method: 'get',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
    params: {
      order: param?.order || 'DESC',
      limit: param?.limit,
      offset: param?.offset,
      idGte: param?.idGte,
      idLte: param?.idLte,
      idGt: param?.idGt,
      idLt: param?.idLt,
    },
  }),
  getSearchPost: (param: IParamGetSearchPost): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}posts`,
    method: 'get',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
    params: { ...param },
  }),
  getRecentSearchKeyword: (param: IParamGetRecentSearchKeywords): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}recent-searches`,
    method: 'get',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
    params: { ...param },
  }),
  postNewRecentSearchKeyword: (data: IParamPostNewRecentSearchKeyword): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}recent-searches`,
    method: 'post',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
    data,
  }),
  deleteClearRecentSearch: (target: IRecentSearchTarget): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}recent-searches/${target}/clean`,
    method: 'delete',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
  }),
  deleteRecentSearchById: (id: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}recent-searches/${id}/delete`,
    method: 'delete',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
  }),
};

const homeDataHelper = {
  getNewsfeed: async (param: IParamGetFeed) => {
    try {
      const response: any = await makeHttpRequest(homeApiConfig.getNewsfeed(param));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getSearchPost: async (param: IParamGetSearchPost) => {
    try {
      const response: any = await makeHttpRequest(homeApiConfig.getSearchPost(param));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getUsers: async (params: IParamsGetUsers) => {
    try {
      const response: any = await makeHttpRequest(ApiConfig.App.getUsers(params));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getRecentSearchKeywords: async (param: IParamGetRecentSearchKeywords) => {
    try {
      const response: any = await makeHttpRequest(homeApiConfig.getRecentSearchKeyword(param));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  postNewRecentSearchKeyword: async (param: IParamPostNewRecentSearchKeyword) => {
    try {
      const response: any = await makeHttpRequest(homeApiConfig.postNewRecentSearchKeyword(param));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteCleanRecentSearch: async (target: IRecentSearchTarget) => {
    try {
      const response: any = await makeHttpRequest(homeApiConfig.deleteClearRecentSearch(target));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteRecentSearchById: async (id: string) => {
    try {
      const response: any = await makeHttpRequest(homeApiConfig.deleteRecentSearchById(id));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default homeDataHelper;
