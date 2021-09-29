import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {IGroupDetailEdit} from '~/interfaces/IGroup';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {StreamClient} from 'getstream';
import {makeGetStreamRequest} from '~/services/httpApiRequest';
import appConfig from '~/configs/appConfig';

export const groupsApiConfig = {
  getMyGroups: (params?: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/my-groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  getUserInnerGroups: (
    groupId: number,
    userId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/inner-groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      user: userId,
    },
  }),
  getGroupMembers: (groupId: number, params: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/users`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  getInfoGroups: (ids: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ids: ids,
    },
  }),
  getGroupDetail: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  editGroupDetail: (
    groupId: number,
    data: IGroupDetailEdit,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      ...data,
    },
  }),
  getJoinableUsers: (groupId: number, params: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joinable-users`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  addUsers: (groupId: number, userIds: number[]): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/users/add`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: false,
    data: {
      user_ids: userIds,
    },
  }),
  removeUsers: (groupId: number, userIds: number[]): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/users/remove`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: false,
    data: {
      user_ids: userIds,
    },
  }),
};

const groupsDataHelper = {
  getMyGroups: async (params?: any) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getMyGroups(params),
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
  getUserInnerGroups: async (groupId: number, userId: number) => {
    try {
      console.log('[Helper] starting', groupId, userId);
      const response: any = await makeHttpRequest(
        groupsApiConfig.getUserInnerGroups(groupId, userId),
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
  getMyGroupPosts: async (
    userId: number,
    groupId: number,
    streamClient?: StreamClient,
    offset?: number,
  ) => {
    if (streamClient) {
      const streamOptions = {
        offset: offset || 0,
        limit: appConfig.recordsPerPage,
        user_id: `${userId}`, //required for CORRECT own_reactions data
        ownReactions: true,
        withOwnReactions: true,
        withOwnChildren: true,
        withRecentReactions: true,
        withReactionCounts: true,
        enrich: true, //extra data for user & group
        ranking: 'important_first', //important posts will on top of results
      };
      try {
        const data = await makeGetStreamRequest(
          streamClient,
          'timeline',
          `g-${groupId}`,
          'get',
          streamOptions,
        );
        return Promise.resolve(data?.results || []);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject('StreamClient not found');
  },
  getInfoGroups: async (ids: string) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getInfoGroups(ids),
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
  getGroupMembers: async (groupId: number, params: any) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getGroupMembers(groupId, params),
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
  getGroupDetail: async (groupId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getGroupDetail(groupId),
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
  editGroupDetail: async (groupId: number, data: IGroupDetailEdit) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.editGroupDetail(groupId, data),
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
  getJoinableUsers: async (groupId: number, params: any) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getJoinableUsers(groupId, params),
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
  addUsers: async (groupId: number, userIds: number[]) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.addUsers(groupId, userIds),
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
  removeUsers: async (groupId: number, userIds: number[]) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.removeUsers(groupId, userIds),
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

export default groupsDataHelper;
