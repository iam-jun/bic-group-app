import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {
  ICommunityDetailEdit,
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
} from '~/interfaces/ICommunity';
import {makeHttpRequest} from '~/services/httpApiRequest';
import appConfig from '~/configs/appConfig';

export const groupsApiConfig = {
  getMyPermissions: (): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}me/permissions`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getCommunityGroupsTree: (id: number | string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${id}/group-structure`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  putGroupStructureReorder: (
    communityId: number,
    data: number[],
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-structure/order`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data,
  }),
  getCommunityStructureMoveTargets: (
    communityId: number,
    groupId: number,
    key?: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-structure/move-targets/${groupId}`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    ...(key ? {params: {key}} : {}),
  }),
  putGroupStructureMoveToTarget: (
    communityId: number,
    moveId: number,
    targetId: number,
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
    communityId: number,
    groupId: number,
    status: boolean,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-structure/collapse/${groupId}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {status},
  }),
  getPermissionCategories: (
    scope?: 'SYSTEM' | 'COMMUNITY' | 'GROUP',
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}permissions/categories`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {scope},
  }),
  getSystemScheme: (): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}system-scheme`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getCommunityScheme: (communityId: number | string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/scheme`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getGroupSchemeAssignments: (communityId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-scheme-assignments`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  putGroupSchemeAssignments: (
    communityId: number,
    data: any[],
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-scheme-assignments`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {data},
  }),
  updateCommunityScheme: (
    communityId: string | number,
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
  deleteCommunityScheme: (
    communityId: number | string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/scheme`,
    method: 'delete',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getSchemes: (communityId: number | string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/schemes`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  getGroupScheme: (
    communityId: number | string,
    schemeId: string,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/group-schemes/${schemeId}`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  updateGroupScheme: (
    communityId: number | string,
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
    communityId: string | number,
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
    url: `${ApiConfig.providers.bein.url}post-audiences/groups`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      group_ids: ids,
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
    useRetry: true,
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
    useRetry: true,
    data: {
      [type || 'user_ids']: userIds,
    },
  }),
  joinGroup: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/join`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  cancelJoinGroup: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/cancel-joining-request`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  leaveGroup: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/leave`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: true,
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
  getGroupMemberRequests: (
    groupId: number,
    params: any,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      ...params,
      sort: 'updated_at:desc',
      key: !!params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  approveSingleGroupMemberRequest: (
    groupId: number,
    requestId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/${requestId}/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  approveAllGroupMemberRequests: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  declineSingleGroupMemberRequest: (
    groupId: number,
    requestId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/${requestId}/decline`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  declineAllGroupMemberRequests: (groupId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${groupId}/joining-requests/decline`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
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
    useRetry: true,
  }),
  cancelJoinCommunity: (communityId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/cancel-joining-request`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
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
      sort: 'updated_at:desc',
      key: !!params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  approveSingleCommunityMemberRequest: (
    communityId: number,
    requestId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/joining-requests/${requestId}/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  declineSingleCommunityMemberRequest: (
    communityId: number,
    requestId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/joining-requests/${requestId}/decline`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  approveAllCommunityMemberRequests: (
    communityId: number,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}communities/${communityId}/joining-requests/approve`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  declineAllCommunityMemberRequests: (
    communityId: number,
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
      key: !!params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  editCommunityDetail: (
    communityId: number,
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
};

const groupsDataHelper = {
  getMyPermissions: async () => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getMyPermissions(),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getCommunityGroupTree: async (id: number | string) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getCommunityGroupsTree(id),
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
  putGroupStructureReorder: async (communityId: number, data: number[]) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.putGroupStructureReorder(communityId, data),
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
  getCommunityStructureMoveTargets: async (
    communityId: number,
    groupId: number,
    key?: string,
  ) => {
    try {
      if (!communityId || !groupId) {
        return Promise.reject(
          'getCommunityStructureMoveTargets invalid params',
        );
      }
      const response: any = await makeHttpRequest(
        groupsApiConfig.getCommunityStructureMoveTargets(
          communityId,
          groupId,
          key,
        ),
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
  putGroupStructureMoveToTarget: async (
    communityId: number,
    moveId: number,
    targetId: number,
  ) => {
    try {
      if (!communityId || !moveId || !targetId) {
        return Promise.reject('putGroupStructureMoveToTarget invalid params');
      }
      const response: any = await makeHttpRequest(
        groupsApiConfig.putGroupStructureMoveToTarget(
          communityId,
          moveId,
          targetId,
        ),
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
  putGroupStructureCollapseStatus: async (
    communityId: number,
    groupId: number,
    status: boolean,
  ) => {
    try {
      if (!communityId || !groupId) {
        return Promise.reject('putGroupStructureCollapseStatus invalid params');
      }
      const response: any = await makeHttpRequest(
        groupsApiConfig.putGroupStructureCollapseStatus(
          communityId,
          groupId,
          status,
        ),
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
  getPermissionCategories: async (scope?: 'SYSTEM' | 'COMMUNITY' | 'GROUP') => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getPermissionCategories(scope),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getSystemScheme: async () => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getSystemScheme(),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getCommunityScheme: async (communityId: number | string) => {
    try {
      if (!communityId) {
        return Promise.reject('getCommunityScheme invalid communityId');
      }
      const response: any = await makeHttpRequest(
        groupsApiConfig.getCommunityScheme(communityId),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  updateCommunityScheme: async (
    communityId: number | string,
    scheme: IScheme,
  ) => {
    if (!communityId || !scheme) {
      return Promise.reject('updateCommunityScheme invalid data');
    }
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.updateCommunityScheme(communityId, scheme),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteCommunityScheme: async (communityId: number | string) => {
    try {
      if (!communityId) {
        return Promise.reject('deleteCommunityScheme invalid communityId');
      }
      const response: any = await makeHttpRequest(
        groupsApiConfig.deleteCommunityScheme(communityId),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getSchemes: async (communityId: number | string) => {
    try {
      if (!communityId) {
        return Promise.reject('getSchemes invalid communityId');
      }
      const response: any = await makeHttpRequest(
        groupsApiConfig.getSchemes(communityId),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getGroupScheme: async (communityId: number | string, schemeId: string) => {
    try {
      if (!communityId || !schemeId) {
        return Promise.reject('getGroupScheme invalid communityId or schemeId');
      }
      const response: any = await makeHttpRequest(
        groupsApiConfig.getGroupScheme(communityId, schemeId),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getGroupSchemeAssignments: async (communityId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getGroupSchemeAssignments(communityId),
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
  putGroupSchemeAssignments: async (params: IPayloadGroupSchemeAssignments) => {
    try {
      const {communityId, data} = params || {};
      const response: any = await makeHttpRequest(
        groupsApiConfig.putGroupSchemeAssignments(communityId, data),
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
  updateGroupScheme: async (
    communityId: number | string,
    schemeId: string,
    schemeData: IScheme,
  ) => {
    try {
      if (!communityId || !schemeId || !schemeData) {
        return Promise.reject('updateGroupScheme invalid inputs');
      }
      const response: any = await makeHttpRequest(
        groupsApiConfig.updateGroupScheme(communityId, schemeId, schemeData),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  postCreateSchemePermission: async (
    communityId: number | string,
    scheme: IScheme,
  ) => {
    if (!communityId || !scheme) {
      return Promise.reject('postCreateSchemePermission invalid data');
    }
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.postCreateSchemePermission(communityId, scheme),
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
  getGroupMemberRequests: async (groupId: number, params: any) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getGroupMemberRequests(groupId, params),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  approveSingleGroupMemberRequest: async (
    groupId: number,
    requestId: number,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.approveSingleGroupMemberRequest(groupId, requestId),
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
  approveAllGroupMemberRequests: async (groupId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.approveAllGroupMemberRequests(groupId),
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
  declineSingleGroupMemberRequest: async (
    groupId: number,
    requestId: number,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.declineSingleGroupMemberRequest(groupId, requestId),
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
  declineAllGroupMemberRequests: async (groupId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.declineAllGroupMemberRequests(groupId),
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
      if (response && response?.data?.data) {
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
      if (response && response?.data?.data) {
        return Promise.resolve(response?.data?.data);
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
      if (response && response?.data?.data) {
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
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  approveSingleCommunityMemberRequest: async (
    communityId: number,
    requestId: number,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.approveSingleCommunityMemberRequest(
          communityId,
          requestId,
        ),
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
  declineSingleCommunityMemberRequest: async (
    communityId: number,
    requestId: number,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.declineSingleCommunityMemberRequest(
          communityId,
          requestId,
        ),
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
  approveAllCommunityMemberRequests: async (communityId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.approveAllCommunityMemberRequests(communityId),
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
  declineAllCommunityMemberRequests: async (communityId: number) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.declineAllCommunityMemberRequests(communityId),
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
  getCommunities: async (params?: IParamGetCommunities) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getCommunities(params),
      );
      if (response && response?.data?.data) {
        return Promise.resolve(response.data.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  editCommunityDetail: async (
    communityId: number,
    data: ICommunityDetailEdit,
  ) => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.editCommunityDetail(communityId, data),
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
