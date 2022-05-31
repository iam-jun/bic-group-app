import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {
  IGetCommunityGroup,
  IGroupDetailEdit,
  IParamGetCommunities,
  IParamGetGroupPosts,
} from '~/interfaces/IGroup';
import {
  IParamGetCommunityMembers,
  IParamGetDiscoverGroups,
} from '~/interfaces/ICommunity';
import {makeHttpRequest} from '~/services/httpApiRequest';
import appConfig from '~/configs/appConfig';

export const groupsApiConfig = {
  getGroupPosts: (params?: IParamGetGroupPosts): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}api/v1/feeds/timeline`,
    method: 'get',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
    params,
  }),
  getSearchGroups: (params?: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  getUserInnerGroups: (
    groupId: number,
    username: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/inner-groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      username,
    },
  }),
  getGroupMembers: (groupId: number, params: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/users`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: !!params?.key?.trim?.() ? params.key : undefined,
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
  getJoinableUsers: (groupId: number, params: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joinable-users`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: !!params?.key?.trim?.() ? params.key : undefined,
    },
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
  removeUsers: (
    groupId: number,
    userIds: (number | string)[],
    type?: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/users/remove`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: false,
    data: {
      [type || 'user_ids']: userIds,
    },
  }),
  joinGroup: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/join`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: false,
  }),
  cancelJoinGroup: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/cancel-joining-request`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: false,
  }),
  leaveGroup: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/leave`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: false,
  }),
  setGroupAdmin: (
    groupId: number,
    userIds: number[],
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/assign-admin`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      user_ids: userIds,
    },
  }),
  removeGroupAdmin: (
    groupId: number,
    userId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/revoke-admin/${userId}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getMemberRequests: (groupId: number, params: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: !!params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  approveSingleMemberRequest: (
    groupId: number,
    requestId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/${requestId}/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  approveAllMemberRequests: (
    groupId: number,
    total: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      total_joining_requests: total,
    },
  }),
  declineSingleMemberRequest: (
    groupId: number,
    requestId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/${requestId}/decline`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  declineAllMemberRequests: (
    groupId: number,
    total: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/decline`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      total_joining_requests: total,
    },
  }),
  getInnerGroupsLastAdmin: (
    groupId: number,
    userId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/inner-groups-have-last-admin/${userId}`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getDiscoverCommunities: (
    params: IParamGetCommunities,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/discover`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: !!params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getJoinedCommunities: (params: {
    preview_members?: boolean;
    managed?: boolean;
  }): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}me/communities`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  getCommunityGroups: (
    id: number,
    otherParams: IGetCommunityGroup,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}me/communities/${id}/groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...otherParams,
      key: !!otherParams?.key?.trim?.() ? otherParams.key : undefined,
    },
  }),
  getCommunityDetail: (communityId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {preview_members: true},
  }),
  getCommunityMembers: (
    communityId: number,
    params?: IParamGetCommunityMembers,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/members`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: !!params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getDiscoverGroups: (
    communityId: number,
    params?: IParamGetDiscoverGroups,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/groups/discover`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  joinCommunity: (communityId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/join`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: false,
  }),
  cancelJoinCommunity: (communityId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/cancel-joining-request`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: false,
  }),
  getCommunityMemberRequests: (
    communityId: number,
    params: any,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/joining-requests`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: !!params?.key?.trim?.() ? params.key : undefined,
    },
  }),
};

const groupsDataHelper = {
  getSearchGroups: async (params?: any) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getSearchGroups(params),
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
  getUserInnerGroups: async (groupId: number, username: string) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getUserInnerGroups(groupId, username),
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
  getGroupPosts: async (param: IParamGetGroupPosts) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getGroupPosts({
          offset: param?.offset || 0,
          limit: param?.limit || appConfig.recordsPerPage,
          ...param,
        }),
      );
      if (response && response?.data?.data?.list) {
        return Promise.resolve(response?.data?.data?.list);
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
  removeUsers: async (
    groupId: number,
    userIds: (number | string)[],
    type?: string,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.removeUsers(groupId, userIds, type),
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
  joinGroup: async (groupId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.joinGroup(groupId),
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
  cancelJoinGroup: async (groupId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.cancelJoinGroup(groupId),
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
  leaveGroup: async (groupId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.leaveGroup(groupId),
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
  setGroupAdmin: async (groupId: number, userIds: number[]) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.setGroupAdmin(groupId, userIds),
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
  removeGroupAdmin: async (groupId: number, userId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.removeGroupAdmin(groupId, userId),
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
  getMemberRequests: async (groupId: number, params: any) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getMemberRequests(groupId, params),
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
  approveSingleMemberRequest: async (groupId: number, requestId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.approveSingleMemberRequest(groupId, requestId),
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
  approveAllMemberRequests: async (groupId: number, total: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.approveAllMemberRequests(groupId, total),
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
  declineSingleMemberRequest: async (groupId: number, requestId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.declineSingleMemberRequest(groupId, requestId),
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
  declineAllMemberRequests: async (groupId: number, total: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.declineAllMemberRequests(groupId, total),
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
  getInnerGroupsLastAdmin: async (groupId: number, userId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getInnerGroupsLastAdmin(groupId, userId),
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
  getDiscoverCommunities: async (params?: IParamGetCommunities) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getDiscoverCommunities(params || {}),
      );
      if (response && response?.data) {
        return Promise.resolve(response.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getJoinedCommunities: async (params: {
    preview_members?: boolean;
    managed?: boolean;
  }) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getJoinedCommunities(params),
      );
      if (response && response?.data) {
        return Promise.resolve(response.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getCommunityGroups: async (id: number, params: IGetCommunityGroup) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getCommunityGroups(id, params),
      );
      if (response && response?.data) {
        return Promise.resolve(response.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getCommunityDetail: async (communityId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getCommunityDetail(communityId),
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
  getCommunityMembers: async (
    communityId: number,
    params?: IParamGetCommunityMembers,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getCommunityMembers(communityId, params),
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
  getDiscoverGroups: async (
    communityId: number,
    params?: IParamGetDiscoverGroups,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getDiscoverGroups(communityId, params),
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
  joinCommunity: async (communityId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.joinCommunity(communityId),
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
  cancelJoinCommunity: async (communityId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.cancelJoinCommunity(communityId),
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
  getCommunityMemberRequests: async (communityId: number, params: any) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getCommunityMemberRequests(communityId, params),
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
};

export default groupsDataHelper;
