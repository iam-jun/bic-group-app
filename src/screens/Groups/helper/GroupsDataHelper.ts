import ApiConfig, { HttpApiRequestConfig } from '~/configs/apiConfig';
import {
  IGetCommunityGroup,
  IGroupDetailEdit,
  IParamGetGroupPosts,
  IPayloadGroupSchemeAssignments,
  IScheme,
} from '~/interfaces/IGroup';
import {
  IParamGetCommunities,
  IParamGetCommunityMembers,
  IParamGetDiscoverGroups,
  ICommunityDetailEdit,
} from '~/interfaces/ICommunity';
import { makeHttpRequest, withHttpRequestPromise } from '~/services/httpApiRequest';
import appConfig from '~/configs/appConfig';

export const groupsApiConfig = {
  getMyPermissions: (): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}me/permissions`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getCommunityGroupsTree: (id: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${id}/group-structure`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  putGroupStructureReorder: (
    communityId: string,
    data: number[],
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-structure/order`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data,
  }),
  getCommunityStructureMoveTargets: (
    communityId: string,
    groupId: string,
    key?: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-structure/move-targets/${groupId}`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    ...(key ? { params: { key } } : {}),
  }),
  putGroupStructureMoveToTarget: (
    communityId: string,
    moveId: string,
    targetId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-structure/move`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      group_id: moveId,
      target_outer_group_id: targetId,
    },
  }),
  putGroupStructureCollapseStatus: (
    communityId: string,
    groupId: string,
    status: boolean,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-structure/collapse/${groupId}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: { status },
  }),
  getPermissionCategories: (
    scope?: 'SYSTEM' | 'COMMUNITY' | 'GROUP',
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}permissions/categories`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: { scope },
  }),
  getSystemScheme: (): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}system-scheme`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getCommunityScheme: (communityId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/scheme`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getGroupSchemeAssignments: (communityId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-scheme-assignments`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  putGroupSchemeAssignments: (
    communityId: string,
    data: any[],
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-scheme-assignments`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: { data },
  }),
  updateCommunityScheme: (
    communityId: string,
    schemeData: IScheme,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/scheme`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      ...schemeData,
    },
  }),
  deleteCommunityScheme: (communityId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/scheme`,
    method: 'delete',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getSchemes: (communityId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/schemes`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getGroupScheme: (
    communityId: string,
    schemeId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-schemes/${schemeId}`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  updateGroupScheme: (
    communityId: string,
    schemeId: string,
    schemeData: IScheme,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-schemes/${schemeId}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      ...schemeData,
    },
  }),
  postCreateSchemePermission: (
    communityId: string,
    schemeData: IScheme,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/scheme`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      ...schemeData,
    },
  }),
  getGroupPosts: (params?: IParamGetGroupPosts): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}feeds/timeline`,
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
    groupId: string,
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
  getGroupMembers: (groupId: string, params: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/users`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getInfoGroups: (ids: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}post-audiences/groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      group_ids: ids,
    },
  }),
  getGroupDetail: (groupId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  editGroupDetail: (
    groupId: string,
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
  getJoinableUsers: (groupId: string, params: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joinable-users`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  addUsers: (groupId: string, userIds: string[]): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/users/add`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      user_ids: userIds,
    },
  }),
  removeUsers: (
    groupId: string,
    userIds: string[],
    type?: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/users/remove`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      [type || 'user_ids']: userIds,
    },
  }),
  joinGroup: (groupId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/join`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  cancelJoinGroup: (groupId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/cancel-joining-request`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  leaveGroup: (groupId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/leave`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  setGroupAdmin: (
    groupId: string,
    userIds: string[],
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
    groupId: string,
    userId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/revoke-admin/${userId}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getGroupMemberRequests: (
    groupId: string,
    params: any,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      sort: 'updated_at:desc',
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  approveSingleGroupMemberRequest: (
    groupId: string,
    requestId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/${requestId}/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  approveAllGroupMemberRequests: (groupId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  declineSingleGroupMemberRequest: (
    groupId: string,
    requestId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/${requestId}/decline`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  declineAllGroupMemberRequests: (groupId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/decline`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getInnerGroupsLastAdmin: (
    groupId: string,
    userId: string,
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
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getJoinedCommunities: (params: {
    previewMembers?: boolean;
    managed?: boolean;
  }): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}me/communities`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  getCommunityGroups: (
    id: string,
    otherParams: IGetCommunityGroup,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}me/communities/${id}/groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...otherParams,
      key: otherParams?.key?.trim?.() ? otherParams.key : undefined,
    },
  }),
  getCommunityDetail: (communityId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: { previewMembers: true },
  }),
  editCommunityDetail: (
    communityId: string,
    data: ICommunityDetailEdit,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      ...data,
    },
  }),
  getCommunityMembers: (
    communityId: string,
    params?: IParamGetCommunityMembers,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/members`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getDiscoverGroups: (
    communityId: string,
    params?: IParamGetDiscoverGroups,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/groups/discover`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  joinCommunity: (communityId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/join`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  cancelJoinCommunity: (communityId: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/cancel-joining-request`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getCommunityMemberRequests: (
    communityId: string,
    params: any,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/joining-requests`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      sort: 'updated_at:desc',
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  approveSingleCommunityMemberRequest: (
    communityId: string,
    requestId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/joining-requests/${requestId}/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  declineSingleCommunityMemberRequest: (
    communityId: string,
    requestId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/joining-requests/${requestId}/decline`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  approveAllCommunityMemberRequests: (
    communityId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/joining-requests/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  declineAllCommunityMemberRequests: (
    communityId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/joining-requests/decline`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getCommunities: (params?: IParamGetCommunities): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
};

const groupsDataHelper = {
  getMyPermissions: () => withHttpRequestPromise(groupsApiConfig.getMyPermissions),
  getCommunityGroupTree: (id: string) => withHttpRequestPromise(groupsApiConfig.getCommunityGroupsTree, id),
  // eslint-disable-next-line max-len
  putGroupStructureReorder: (communityId: string, data: string[]) => withHttpRequestPromise(groupsApiConfig.putGroupStructureReorder, communityId, data),
  getCommunityStructureMoveTargets: (
    communityId: string,
    groupId: string,
    key?: string,
  ) => {
    if (!communityId || !groupId) {
      return Promise.reject(
        new Error('getCommunityStructureMoveTargets invalid params'),
      );
    }
    return withHttpRequestPromise(groupsApiConfig.getCommunityStructureMoveTargets, communityId, groupId, key)
  },
  putGroupStructureMoveToTarget: (
    communityId: string,
    moveId: string,
    targetId: string,
  ) => {
    if (!communityId || !moveId || !targetId) {
      return Promise.reject(new Error('putGroupStructureMoveToTarget invalid params'));
    }
    return withHttpRequestPromise(groupsApiConfig.putGroupStructureMoveToTarget, communityId, moveId, targetId)
  },
  putGroupStructureCollapseStatus: (
    communityId: string,
    groupId: string,
    status: boolean,
  ) => {
    if (!communityId || !groupId) {
      return Promise.reject(new Error('putGroupStructureCollapseStatus invalid params'));
    }
    return withHttpRequestPromise(groupsApiConfig.putGroupStructureCollapseStatus, communityId, groupId, status)
  },
  getPermissionCategories: (scope?: 'SYSTEM' | 'COMMUNITY' | 'GROUP') => withHttpRequestPromise(groupsApiConfig.getPermissionCategories, scope),
  getSystemScheme: () => withHttpRequestPromise(groupsApiConfig.getSystemScheme),
  getCommunityScheme: (communityId: string) => {
    if (!communityId) {
      return Promise.reject(new Error('getCommunityScheme invalid communityId'));
    }
    return withHttpRequestPromise(groupsApiConfig.getCommunityScheme, communityId)
  },
  updateCommunityScheme: (communityId: string, scheme: IScheme) => {
    if (!communityId || !scheme) {
      return Promise.reject(new Error('updateCommunityScheme invalid data'));
    }
    return withHttpRequestPromise(groupsApiConfig.updateCommunityScheme, communityId, scheme)
  },
  deleteCommunityScheme: (communityId: string) => {
    if (!communityId) {
      return Promise.reject(new Error('deleteCommunityScheme invalid communityId'));
    }
    return withHttpRequestPromise(groupsApiConfig.deleteCommunityScheme, communityId)
  },
  getSchemes: (communityId: string) => {
    if (!communityId) {
      return Promise.reject(new Error('getSchemes invalid communityId'));
    }
    return withHttpRequestPromise(groupsApiConfig.getSchemes, communityId)
  },
  getGroupScheme: (communityId: string, schemeId: string) => {
    if (!communityId || !schemeId) {
      return Promise.reject(new Error('getGroupScheme invalid communityId or schemeId'));
    }
    return withHttpRequestPromise(groupsApiConfig.getGroupScheme, communityId, schemeId)
  },
  getGroupSchemeAssignments: (communityId: string) => withHttpRequestPromise(groupsApiConfig.getGroupSchemeAssignments, communityId),
  putGroupSchemeAssignments: (params: IPayloadGroupSchemeAssignments) => {
    const { communityId, data } = params || {};
    return withHttpRequestPromise(groupsApiConfig.putGroupSchemeAssignments, communityId, data)
  },
  updateGroupScheme: (communityId: string, schemeId: string, schemeData: IScheme) => {
    if (!communityId || !schemeId || !schemeData) {
      return Promise.reject(new Error('updateGroupScheme invalid inputs'));
    }
    return withHttpRequestPromise(groupsApiConfig.updateGroupScheme, communityId, schemeId, schemeData)
  },
  postCreateSchemePermission: async (communityId: string, scheme: IScheme) => {
    if (!communityId || !scheme) {
      return Promise.reject(new Error('postCreateSchemePermission invalid data'));
    }
    return withHttpRequestPromise(groupsApiConfig.postCreateSchemePermission, communityId, scheme)
  },
  getSearchGroups: async (params?: any) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getSearchGroups(params),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getUserInnerGroups: (groupId: string, username: string) => withHttpRequestPromise(groupsApiConfig.getUserInnerGroups, groupId, username),
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
      }
      return Promise.reject(response);
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
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getGroupMembers: (groupId: string, params: any) => withHttpRequestPromise(groupsApiConfig.getGroupMembers, groupId, params),
  getGroupDetail: (groupId: string) => withHttpRequestPromise(groupsApiConfig.getGroupDetail, groupId),
  editGroupDetail: (groupId: string, data: IGroupDetailEdit) => withHttpRequestPromise(groupsApiConfig.editGroupDetail, groupId, data),
  getJoinableUsers: (groupId: string, params: any) => withHttpRequestPromise(groupsApiConfig.getJoinableUsers, groupId, params),
  addUsers: async (groupId: string, userIds: string[]) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.addUsers(groupId, userIds),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  removeUsers: async (groupId: string, userIds: string[], type?: string) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.removeUsers(groupId, userIds, type),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  joinGroup: (groupId: string) => withHttpRequestPromise(groupsApiConfig.joinGroup, groupId),
  cancelJoinGroup: (groupId: string) => withHttpRequestPromise(groupsApiConfig.cancelJoinGroup, groupId),
  leaveGroup: (groupId: string) => withHttpRequestPromise(groupsApiConfig.leaveGroup, groupId),
  setGroupAdmin: async (groupId: string, userIds: string[]) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.setGroupAdmin(groupId, userIds),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  removeGroupAdmin: async (groupId: string, userId: string) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.removeGroupAdmin(groupId, userId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getGroupMemberRequests: async (groupId: string, params: any) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getGroupMemberRequests(groupId, params),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  approveSingleGroupMemberRequest: async (
    groupId: string,
    requestId: string,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.approveSingleGroupMemberRequest(groupId, requestId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  approveAllGroupMemberRequests: async (groupId: string) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.approveAllGroupMemberRequests(groupId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  declineSingleGroupMemberRequest: async (
    groupId: string,
    requestId: string,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.declineSingleGroupMemberRequest(groupId, requestId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  declineAllGroupMemberRequests: async (groupId: string) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.declineAllGroupMemberRequests(groupId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getInnerGroupsLastAdmin: (groupId: string, userId: string) => withHttpRequestPromise(groupsApiConfig.getInnerGroupsLastAdmin, groupId, userId),
  getDiscoverCommunities: (params?: IParamGetCommunities) => withHttpRequestPromise(groupsApiConfig.getDiscoverCommunities, params),
  getJoinedCommunities: (params: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => withHttpRequestPromise(groupsApiConfig.getJoinedCommunities, params),
  getCommunityGroups: (id: string, params: IGetCommunityGroup) => withHttpRequestPromise(groupsApiConfig.getCommunityGroups, id, params),
  getCommunityDetail: (communityId: string) => withHttpRequestPromise(groupsApiConfig.getCommunityDetail, communityId),
  editCommunityDetail: (
    communityId: string,
    data: ICommunityDetailEdit,
  ) => withHttpRequestPromise(groupsApiConfig.editCommunityDetail, communityId, data),
  getCommunityMembers: (
    communityId: string,
    params?: IParamGetCommunityMembers,
  ) => withHttpRequestPromise(groupsApiConfig.getCommunityMembers, communityId, params),
  getDiscoverGroups: (
    communityId: string,
    params?: IParamGetDiscoverGroups,
  ) => withHttpRequestPromise(groupsApiConfig.getDiscoverGroups, communityId, params),
  joinCommunity: (communityId: string) => withHttpRequestPromise(groupsApiConfig.joinCommunity, communityId),
  cancelJoinCommunity: (communityId: string) => withHttpRequestPromise(groupsApiConfig.cancelJoinCommunity, communityId),
  // eslint-disable-next-line max-len
  getCommunityMemberRequests: (communityId: string, params: any) => withHttpRequestPromise(groupsApiConfig.getCommunityMemberRequests, communityId, params),
  approveSingleCommunityMemberRequest: (
    communityId: string,
    requestId: string,
  ) => withHttpRequestPromise(
    groupsApiConfig.approveSingleCommunityMemberRequest,
    communityId,
    requestId,
  ),
  declineSingleCommunityMemberRequest: (
    communityId: string,
    requestId: string,
  ) => withHttpRequestPromise(
    groupsApiConfig.declineSingleCommunityMemberRequest,
    communityId,
    requestId,
  ),
  approveAllCommunityMemberRequests: (communityId: string) => withHttpRequestPromise(groupsApiConfig.approveAllCommunityMemberRequests, communityId),
  declineAllCommunityMemberRequests: (communityId: string) => withHttpRequestPromise(groupsApiConfig.declineAllCommunityMemberRequests, communityId),
  getCommunities: (params?: IParamGetCommunities) => withHttpRequestPromise(groupsApiConfig.getCommunities, params),
};

export default groupsDataHelper;
