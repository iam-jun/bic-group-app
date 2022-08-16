import { Method } from 'axios';
import { apiProviders, HttpApiRequestConfig } from '~/api/apiConfig';
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
import { makeHttpRequest, withHttpRequestPromise } from '~/api/apiRequest';
import appConfig from '~/configs/appConfig';
import { IUserEdit } from '~/interfaces/IAuth';
import { IAddWorkExperienceReq } from '~/interfaces/IWorkExperienceRequest';
import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';

const provider = apiProviders.bein;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
}

export const groupsApiConfig = {
  getLinkPreview: (link: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}url-metadata`,
    params: { url: link },
  }),
  getUsers: (params: IParamsGetUsers): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getUserProfile: (
    userId: string, params?: any,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${userId}/profile`,
    params,
  }),
  editMyProfile: (
    userId: string, data: IUserEdit,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${userId}/profile`,
    method: 'put',
    data: {
      ...data,
    },
  }),
  getMyWorkExperience: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/work-experience`,
  }),
  addWorkExperience: (data: IAddWorkExperienceReq): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/work-experience`,
    method: 'post',
    useRetry: false,
    data,
  }),
  editWorkExperience: (
    id: string,
    data: IAddWorkExperienceReq,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/work-experience/${id}`,
    method: 'put',
    useRetry: false,
    data,
  }),
  deleteWorkExperience: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/work-experience/${id}`,
    method: 'delete',
    useRetry: false,
  }),
  // get others work experience data
  getWorkExperience: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${id}/work-experience`,
  }),
  getMyPermissions: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/permissions`,
  }),
  getCommunityGroupsTree: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${id}/group-structure`,
  }),
  putGroupStructureReorder: (
    communityId: string,
    data: number[],
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-structure/order`,
    method: 'put',
    data,
  }),
  getCommunityStructureMoveTargets: (
    communityId: string,
    groupId: string,
    key?: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-structure/move-targets/${groupId}`,
    ...(key ? { params: { key } } : {}),
  }),
  putGroupStructureMoveToTarget: (
    communityId: string,
    moveId: string,
    targetId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-structure/move`,
    method: 'put',
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
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-structure/collapse/${groupId}`,
    method: 'put',
    data: { status },
  }),
  getPermissionCategories: (
    scope?: 'SYSTEM' | 'COMMUNITY' | 'GROUP',
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}permissions/categories`,
    params: { scope },
  }),
  getSystemScheme: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}system-scheme`,
  }),
  getCommunityScheme: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/scheme`,
  }),
  getGroupSchemeAssignments: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-scheme-assignments`,
  }),
  putGroupSchemeAssignments: (
    communityId: string,
    data: any[],
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-scheme-assignments`,
    method: 'put',
    data: { data },
  }),
  updateCommunityScheme: (
    communityId: string,
    schemeData: IScheme,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/scheme`,
    method: 'put',
    data: {
      ...schemeData,
    },
  }),
  deleteCommunityScheme: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/scheme`,
    method: 'delete',
  }),
  getSchemes: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/schemes`,
  }),
  getGroupScheme: (
    communityId: string,
    schemeId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-schemes/${schemeId}`,
  }),
  updateGroupScheme: (
    communityId: string,
    schemeId: string,
    schemeData: IScheme,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-schemes/${schemeId}`,
    method: 'put',
    data: {
      ...schemeData,
    },
  }),
  postCreateSchemePermission: (
    communityId: string,
    schemeData: IScheme,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/scheme`,
    method: 'post',
    data: {
      ...schemeData,
    },
  }),

  // todo move to stream
  getGroupPosts: (params?: IParamGetGroupPosts): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${apiProviders.beinFeed.url}feeds/timeline`,
    provider: apiProviders.beinFeed,
    params,
  }),

  getUserInnerGroups: (
    groupId: string,
    username: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/inner-groups`,
    params: {
      username,
    },
  }),
  getGroupMembers: (groupId: string, params: any): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/users`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getInfoGroups: (groupIds: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}post-audiences/groups`,
    params: { groupIds },
  }),
  getGroupDetail: (groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}`,
  }),
  editGroupDetail: (
    groupId: string,
    data: IGroupDetailEdit,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}`,
    method: 'put',
    data: {
      ...data,
    },
  }),
  getJoinableUsers: (groupId: string, params: any): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/joinable-users`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  addUsers: (groupId: string, userIds: string[]): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/users/add`,
    method: 'post',
    data: { userIds },
  }),
  removeUsers: (
    groupId: string,
    userIds: string[],
    type?: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/users/remove`,
    method: 'put',
    data: {
      [type || 'userIds']: userIds,
    },
  }),
  joinGroup: (groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/join`,
    method: 'post',
  }),
  cancelJoinGroup: (groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/cancel-joining-request`,
    method: 'put',
  }),
  leaveGroup: (groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/leave`,
    method: 'post',
  }),
  setGroupAdmin: (
    groupId: string,
    userIds: string[],
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/assign-admin`,
    method: 'post',
    data: { userIds },
  }),
  removeGroupAdmin: (
    groupId: string,
    userId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/revoke-admin/${userId}`,
    method: 'put',
  }),
  getGroupMemberRequests: (
    groupId: string,
    params: any,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/joining-requests`,
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
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/joining-requests/${requestId}/approve`,
    method: 'put',
  }),
  approveAllGroupMemberRequests: (groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/joining-requests/approve`,
    method: 'put',
  }),
  declineSingleGroupMemberRequest: (
    groupId: string,
    requestId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/joining-requests/${requestId}/decline`,
    method: 'put',
  }),
  declineAllGroupMemberRequests: (groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/joining-requests/decline`,
    method: 'put',
  }),
  getInnerGroupsLastAdmin: (
    groupId: string,
    userId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/inner-groups-have-last-admin/${userId}`,
  }),
  getDiscoverCommunities: (
    params: IParamGetCommunities,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/discover`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getJoinedCommunities: (params: {
    previewMembers?: boolean;
    managed?: boolean;
  }): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/communities`,
    params,
  }),
  getCommunityGroups: (
    id: string,
    otherParams: IGetCommunityGroup,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/communities/${id}/groups`,
    params: {
      ...otherParams,
      key: otherParams?.key?.trim?.() ? otherParams.key : undefined,
    },
  }),
  getCommunityDetail: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}`,
    params: { previewMembers: true },
  }),
  editCommunityDetail: (
    communityId: string,
    data: ICommunityDetailEdit,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}`,
    method: 'put',
    data: {
      ...data,
    },
  }),
  getCommunityMembers: (
    communityId: string,
    params?: IParamGetCommunityMembers,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/members`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getDiscoverGroups: (
    communityId: string,
    params?: IParamGetDiscoverGroups,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/groups/discover`,
    params,
  }),
  joinCommunity: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/join`,
    method: 'post',
  }),
  cancelJoinCommunity: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/cancel-joining-request`,
    method: 'put',
  }),
  getCommunityMemberRequests: (
    communityId: string,
    params: any,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/joining-requests`,
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
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/joining-requests/${requestId}/approve`,
    method: 'put',
  }),
  declineSingleCommunityMemberRequest: (
    communityId: string,
    requestId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/joining-requests/${requestId}/decline`,
    method: 'put',
  }),
  approveAllCommunityMemberRequests: (
    communityId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/joining-requests/approve`,
    method: 'put',
  }),
  declineAllCommunityMemberRequests: (
    communityId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/joining-requests/decline`,
    method: 'put',
  }),
  getCommunities: (params?: IParamGetCommunities): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
};

const groupApi = {
  getLinkPreview: (link: string) => withHttpRequestPromise(groupsApiConfig.getLinkPreview, link),
  getUsers: async (params: IParamsGetUsers) => {
    try {
      const response: any = await makeHttpRequest(groupsApiConfig.getUsers(params));
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getUserProfile: (userId: string, params?: any) => withHttpRequestPromise(
    groupsApiConfig.getUserProfile, userId, params,
  ),
  editMyProfile: (params: any) => {
    const { userId, data } = params || {}
    return withHttpRequestPromise(groupsApiConfig.editMyProfile, userId, data)
  },
  getMyWorkExperience: () => withHttpRequestPromise(groupsApiConfig.getMyWorkExperience),
  addWorkExperience: (data: IAddWorkExperienceReq) => withHttpRequestPromise(
    groupsApiConfig.addWorkExperience, data,
  ),
  editWorkExperience: (id: string, data: IAddWorkExperienceReq) => withHttpRequestPromise(
    groupsApiConfig.editWorkExperience, id, data,
  ),
  deleteWorkExperience: (id: string) => withHttpRequestPromise(groupsApiConfig.deleteWorkExperience, id),
  getWorkExperience: (id: string) => withHttpRequestPromise(groupsApiConfig.getWorkExperience, id),
  getMyPermissions: () => withHttpRequestPromise(groupsApiConfig.getMyPermissions),
  getCommunityGroupTree: (id: string) => withHttpRequestPromise(groupsApiConfig.getCommunityGroupsTree, id),
  putGroupStructureReorder: (communityId: string, data: string[]) => withHttpRequestPromise(
    groupsApiConfig.putGroupStructureReorder, communityId, data,
  ),
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
  getGroupSchemeAssignments: (communityId: string) => withHttpRequestPromise(
    groupsApiConfig.getGroupSchemeAssignments, communityId,
  ),
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
  postCreateSchemePermission: (communityId: string, scheme: IScheme) => {
    if (!communityId || !scheme) {
      return Promise.reject(new Error('postCreateSchemePermission invalid data'));
    }
    return withHttpRequestPromise(groupsApiConfig.postCreateSchemePermission, communityId, scheme)
  },
  getUserInnerGroups: (groupId: string, username: string) => withHttpRequestPromise(
    groupsApiConfig.getUserInnerGroups, groupId, username,
  ),
  getGroupPosts: (param: IParamGetGroupPosts) => withHttpRequestPromise(groupsApiConfig.getGroupPosts, {
    offset: param?.offset || 0,
    limit: param?.limit || appConfig.recordsPerPage,
    ...param,
  }),
  getInfoGroups: (groupIds: string) => withHttpRequestPromise(groupsApiConfig.getInfoGroups, groupIds),
  getGroupMembers: (groupId: string, params: any) => withHttpRequestPromise(
    groupsApiConfig.getGroupMembers, groupId, params,
  ),
  getGroupDetail: (groupId: string) => withHttpRequestPromise(
    groupsApiConfig.getGroupDetail, groupId,
  ),
  editGroupDetail: (groupId: string, data: IGroupDetailEdit) => withHttpRequestPromise(
    groupsApiConfig.editGroupDetail, groupId, data,
  ),
  getJoinableUsers: (groupId: string, params: any) => withHttpRequestPromise(
    groupsApiConfig.getJoinableUsers, groupId, params,
  ),
  addUsers: (groupId: string, userIds: string[]) => withHttpRequestPromise(groupsApiConfig.addUsers, groupId, userIds),
  removeUsers: (groupId: string, userIds: string[], type?: string) => withHttpRequestPromise(
    groupsApiConfig.removeUsers, groupId, userIds, type,
  ),
  joinGroup: (groupId: string) => withHttpRequestPromise(groupsApiConfig.joinGroup, groupId),
  cancelJoinGroup: (groupId: string) => withHttpRequestPromise(groupsApiConfig.cancelJoinGroup, groupId),
  leaveGroup: (groupId: string) => withHttpRequestPromise(groupsApiConfig.leaveGroup, groupId),
  setGroupAdmin: (groupId: string, userIds: string[]) => withHttpRequestPromise(
    groupsApiConfig.setGroupAdmin, groupId, userIds,
  ),
  removeGroupAdmin: (groupId: string, userId: string) => withHttpRequestPromise(
    groupsApiConfig.removeGroupAdmin, groupId, userId,
  ),
  getGroupMemberRequests: (groupId: string, params: any) => withHttpRequestPromise(
    groupsApiConfig.getGroupMemberRequests, groupId, params,
  ),
  approveSingleGroupMemberRequest: (
    groupId: string,
    requestId: string,
  ) => withHttpRequestPromise(groupsApiConfig.approveSingleGroupMemberRequest, groupId, requestId),
  approveAllGroupMemberRequests: (groupId: string) => withHttpRequestPromise(
    groupsApiConfig.approveAllGroupMemberRequests, groupId,
  ),
  declineSingleGroupMemberRequest: (
    groupId: string,
    requestId: string,
  ) => withHttpRequestPromise(groupsApiConfig.declineSingleGroupMemberRequest, groupId, requestId),
  declineAllGroupMemberRequests: (groupId: string) => withHttpRequestPromise(
    groupsApiConfig.declineAllGroupMemberRequests, groupId,
  ),
  getInnerGroupsLastAdmin: (groupId: string, userId: string) => withHttpRequestPromise(
    groupsApiConfig.getInnerGroupsLastAdmin, groupId, userId,
  ),
  getDiscoverCommunities: (params?: IParamGetCommunities) => withHttpRequestPromise(
    groupsApiConfig.getDiscoverCommunities, params,
  ),
  getJoinedCommunities: (params: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => withHttpRequestPromise(groupsApiConfig.getJoinedCommunities, params),
  getCommunityGroups: (id: string, params: IGetCommunityGroup) => withHttpRequestPromise(
    groupsApiConfig.getCommunityGroups, id, params,
  ),
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
  joinCommunity: (communityId: string) => withHttpRequestPromise(
    groupsApiConfig.joinCommunity, communityId,
  ),
  cancelJoinCommunity: (communityId: string) => withHttpRequestPromise(
    groupsApiConfig.cancelJoinCommunity, communityId,
  ),
  getCommunityMemberRequests: (communityId: string, params: any) => withHttpRequestPromise(
    groupsApiConfig.getCommunityMemberRequests, communityId, params,
  ),
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
  approveAllCommunityMemberRequests: (communityId: string) => withHttpRequestPromise(
    groupsApiConfig.approveAllCommunityMemberRequests, communityId,
  ),
  declineAllCommunityMemberRequests: (communityId: string) => withHttpRequestPromise(
    groupsApiConfig.declineAllCommunityMemberRequests, communityId,
  ),
  getCommunities: (params?: IParamGetCommunities) => withHttpRequestPromise(groupsApiConfig.getCommunities, params),
};

export default groupApi;
