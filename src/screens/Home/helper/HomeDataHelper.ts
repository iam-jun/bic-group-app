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
    url: `${ApiConfig.providers.beinFeed.url}api/feeds/newsfeed`,
    method: 'get',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
    params: {
      offset: param?.offset || 0,
      limit: param?.limit || 10,
      recent_reactions_limit: param.recent_reactions_limit,
      enrich: param?.enrich,
      own_reactions: param?.own_reactions,
      with_own_reactions: param?.with_own_reactions,
      with_own_children: param?.with_own_children,
      with_recent_reactions: param?.with_recent_reactions,
      with_reaction_counts: param?.with_reaction_counts,
      ranking: param?.ranking,
    },
  }),
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
  getNewsfeed: async (param: IParamGetFeed) => {
    try {
      const response: any = await makeHttpRequest(
        homeApiConfig.getNewsfeed({
          enrich: true,
          own_reactions: true,
          with_own_reactions: true,
          with_own_children: true,
          with_recent_reactions: true,
          with_reaction_counts: true,
          ...param,
        }),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data?.results);
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
