import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {IGroupDetailEdit} from '~/interfaces/IGroup';
import {makeHttpRequest} from '~/services/httpApiRequest';

export const groupsApiConfig = {
  getMyGroups: (): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/my-groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getMyGroupPosts: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/timeline`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getGroupMembers: (
    groupId: number,
    offset?: number,
    limit?: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/users`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      offset: offset,
      limit: limit,
    },
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
  uploadImage: (data: FormData): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}files/upload-photos`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    useRetry: false,
    data,
  }),
};

const groupsDataHelper = {
  getMyGroups: async () => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getMyGroups(),
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
  getMyGroupPosts: async (groupId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getMyGroupPosts(groupId),
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
  getGroupMembers: async (groupId: number, offset?: number, limit?: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getGroupMembers(groupId, offset, limit),
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
  uploadImage: async (data: FormData) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.uploadImage(data),
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
