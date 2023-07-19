import { Method } from 'axios';
import { apiProviders, apiVersionId, HttpApiRequestConfig } from '~/api/apiConfig';
import {
  IGetCommunityGroup,
  IGroupDetailEdit,
  IParamsGetJoinedAllGroups,
  IParamsGetManagedCommunityAndGroup,
  IPayloadGroupSchemeAssignments,
  IScheme,
} from '~/interfaces/IGroup';
import {
  IParamGetCommunities,
  IParamGetDiscoverGroups,
  MembershipAnswerRequestParam,
} from '~/interfaces/ICommunity';
import { withHttpRequestPromise } from '~/api/apiRequest';
import {
  IParamValidateReferralCode,
} from '~/interfaces/IAuth';
import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';
import { IParamsReportMember } from '~/interfaces/IReport';
import { ContentType } from '~/components/SelectAudience';
import { IGroupSettings } from '~/interfaces/common';

const provider = apiProviders.bein;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
  headers: {
    'x-version-id': apiVersionId.group,
  },
};

export const groupsApiConfig = {
  getCommunityCUDTagPermission: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/permissions/can-cud-tags/community/${communityId}`,
  }),
  updateGroupJoinSetting: (groupId: string, settings: IGroupSettings): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/settings`,
    method: 'put',
    data: { ...settings },
  }),
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
  getLanguages: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}languages`,
  }),
  getCountry: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}countries`,
  }),
  getCity: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}cities?country_code=84`,
  }),
  getMyPermissions: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/permissions`,
  }),
  getCommunityGroupsTree: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${id}/group-structure`,
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
  getGroupSchemeAssignments: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-scheme-assignments`,
  }),
  assignSchemesToGroups: (
    communityId: string,
    data: any[],
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/group-scheme-assignments`,
    method: 'put',
    data: { data },
  }),
  createGeneralScheme: (
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
  getGeneralScheme: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/scheme`,
  }),
  updateGeneralScheme: (
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
  deleteGeneralScheme: (communityId: string): HttpApiRequestConfig => ({
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

  getUserInnerGroups: (
    groupId: string,
    userId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/inner-groups`,
    params: {
      userId,
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
  getSearchAudiences: (params: {
    contentType: ContentType; key: string, offset?: number, limit?: number
  }): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}post-audiences`,
    provider: apiProviders.bein,
    params: {
      content: params?.contentType,
      key: params?.key,
      offset: params?.offset || 0,
      limit: params?.limit || 25,
    },
  }),
  getAudienceTree: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}post-audiences/trees`,
  }),
  getGroupDetail: (groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}`,
    params: { previewMembers: true },
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
  addUsersToGroup: (userIds: string[], groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/users/add`,
    method: 'post',
    data: { userIds },
  }),
  removeGroupMembers: (
    groupId: string,
    userIds: string[],
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/users/remove`,
    method: 'put',
    data: { userIds },
  }),
  joinGroup: (groupId: string, params?: MembershipAnswerRequestParam): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/join`,
    method: 'post',
    data: { ...params },
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
    userId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/assign-admin`,
    method: 'put',
    data: { userId },
  }),
  removeGroupAdmin: (
    groupId: string,
    userId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/revoke-admin`,
    method: 'put',
    data: { userId },
  }),
  getGroupMemberRequests: (
    groupId: string,
    params: any,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/join-requests`,
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
  searchJoinedCommunities: (
    params: IParamGetCommunities,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/search/groups`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  searchJoinedCommunitiesOnly: (
    params: IParamGetCommunities,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/communities`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getJoinedCommunities: (params: {
    previewMembers?: boolean;
    managed?: boolean;
    offset?: number;
    limit?: number;
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
  getDiscoverGroups: (
    communityId: string,
    params?: IParamGetDiscoverGroups,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/groups/discover`,
    params,
  }),
  joinCommunity: (rootGroupId: string, params?: MembershipAnswerRequestParam): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${rootGroupId}/join`,
    method: 'post',
    data: { ...params },
  }),
  cancelJoinCommunity: (rootGroupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${rootGroupId}/cancel-joining-request`,
    method: 'put',
  }),
  leaveCommunity: (rootGroupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${rootGroupId}/leave`,
    method: 'post',
  }),
  getCommunities: (params?: IParamGetCommunities): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getJoinedAllGroups: (
    params: IParamsGetJoinedAllGroups,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/groups`,
    params,
  }),
  getOwnerCommunity: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/communities/owned`,
  }),
  getManagedCommunityAndGroup: (
    params: IParamsGetManagedCommunityAndGroup,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/groups/manage`,
    params,
  }),
  getReportReasons: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}manage/communities/reports/reasons`,
  }),
  getMemberReportReasons: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}member-report-reasons`,
  }),
  reportMember: (
    communityId: string,
    params: IParamsReportMember,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/member-reports`,
    method: 'post',
    data: { ...params },
  }),
  reportMemberByUserId: (
    userId: string,
    params: IParamsReportMember,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${userId}/member-reports`,
    method: 'post',
    data: { ...params },
  }),
  validateReferralCode: (param: IParamValidateReferralCode): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}public/referral/verify`,
    params: { ...param },
  }),
  getGroupTerms: (groupId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/terms`,
  }),
  getMembershipQuestions: (groupId: string) : HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/membership-questions`,
  }),
  getUserNotFoundInfo: (email: string) : HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}/public/users/${email}/verify`,
  }),
  getOwnedBadges: () : HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}/me/owned-badges`,
  }),
  putShowingBadges: (badgeIds: string[]) : HttpApiRequestConfig => ({
    ...defaultConfig,
    method: 'put',
    url: `${provider.url}/me/showing-badges`,
    data: { badgeIds },
  }),
  markNewBadge: (badgeIds: string[]) : HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/owned-badges/new-label`,
    method: 'delete',
    data: {
      badgeIds,
    },
  }),
};

const groupApi = {
  getCommunityCUDTagPermission: (communityId: string) => withHttpRequestPromise(
    groupsApiConfig.getCommunityCUDTagPermission, communityId,
  ),
  updateGroupJoinSetting: (groupId: string, settings: IGroupSettings) => withHttpRequestPromise(
    groupsApiConfig.updateGroupJoinSetting, groupId, settings,
  ),
  getLinkPreview: (link: string) => withHttpRequestPromise(
    groupsApiConfig.getLinkPreview, link,
  ),
  getUsers: async (params: IParamsGetUsers) => withHttpRequestPromise(
    groupsApiConfig.getUsers, params,
  ),
  getLanguages: () => withHttpRequestPromise(
    groupsApiConfig.getLanguages,
  ),
  getCountry: () => withHttpRequestPromise(
    groupsApiConfig.getCountry,
  ),
  getCity: () => withHttpRequestPromise(
    groupsApiConfig.getCity,
  ),
  getMyPermissions: () => withHttpRequestPromise(groupsApiConfig.getMyPermissions),
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
    return withHttpRequestPromise(
      groupsApiConfig.getCommunityStructureMoveTargets,
      communityId,
      groupId,
      key,
    );
  },
  putGroupStructureCollapseStatus: (
    communityId: string,
    groupId: string,
    status: boolean,
  ) => {
    if (!communityId || !groupId) {
      return Promise.reject(
        new Error('putGroupStructureCollapseStatus invalid params'),
      );
    }
    return withHttpRequestPromise(
      groupsApiConfig.putGroupStructureCollapseStatus,
      communityId,
      groupId,
      status,
    );
  },
  getPermissionCategories: (scope?: 'SYSTEM' | 'COMMUNITY' | 'GROUP') => withHttpRequestPromise(
    groupsApiConfig.getPermissionCategories, scope,
  ),
  getSystemScheme: () => withHttpRequestPromise(groupsApiConfig.getSystemScheme),
  createGeneralScheme: (communityId: string, scheme: IScheme) => {
    if (!communityId || !scheme) {
      return Promise.reject(
        new Error('createGeneralScheme invalid data'),
      );
    }
    return withHttpRequestPromise(
      groupsApiConfig.createGeneralScheme,
      communityId,
      scheme,
    );
  },
  getGeneralScheme: (communityId: string) => {
    if (!communityId) {
      return Promise.reject(
        new Error('getGeneralScheme invalid communityId'),
      );
    }
    return withHttpRequestPromise(
      groupsApiConfig.getGeneralScheme,
      communityId,
    );
  },
  updateGeneralScheme: (communityId: string, scheme: IScheme) => {
    if (!communityId || !scheme) {
      return Promise.reject(new Error('updateGeneralScheme invalid data'));
    }
    return withHttpRequestPromise(
      groupsApiConfig.updateGeneralScheme,
      communityId,
      scheme,
    );
  },
  deleteGeneralScheme: (communityId: string) => {
    if (!communityId) {
      return Promise.reject(
        new Error('deleteGeneralScheme invalid communityId'),
      );
    }
    return withHttpRequestPromise(
      groupsApiConfig.deleteGeneralScheme,
      communityId,
    );
  },
  getSchemes: (communityId: string) => {
    if (!communityId) {
      return Promise.reject(new Error('getSchemes invalid communityId'));
    }
    return withHttpRequestPromise(groupsApiConfig.getSchemes, communityId);
  },
  getGroupScheme: (communityId: string, schemeId: string) => {
    if (!communityId || !schemeId) {
      return Promise.reject(
        new Error('getGroupScheme invalid communityId or schemeId'),
      );
    }
    return withHttpRequestPromise(
      groupsApiConfig.getGroupScheme,
      communityId,
      schemeId,
    );
  },
  getGroupSchemeAssignments: (communityId: string) => withHttpRequestPromise(
    groupsApiConfig.getGroupSchemeAssignments,
    communityId,
  ),
  assignSchemesToGroups: (params: IPayloadGroupSchemeAssignments) => {
    const { communityId, data } = params || {};
    return withHttpRequestPromise(
      groupsApiConfig.assignSchemesToGroups,
      communityId,
      data,
    );
  },
  updateGroupScheme: (
    communityId: string,
    schemeId: string,
    schemeData: IScheme,
  ) => {
    if (!communityId || !schemeId || !schemeData) {
      return Promise.reject(new Error('updateGroupScheme invalid inputs'));
    }
    return withHttpRequestPromise(
      groupsApiConfig.updateGroupScheme,
      communityId,
      schemeId,
      schemeData,
    );
  },
  getUserInnerGroups: (groupId: string, userId: string) => withHttpRequestPromise(
    groupsApiConfig.getUserInnerGroups,
    groupId,
    userId,
  ),
  getSearchAudiences: (params: {
    contentType: ContentType; key: string, offset?: number, limit?: number
  }) => withHttpRequestPromise(
    groupsApiConfig.getSearchAudiences, params,
  ),
  getAudienceTree: () => withHttpRequestPromise(groupsApiConfig.getAudienceTree),
  getGroupMembers: (groupId: string, params: any) => withHttpRequestPromise(
    groupsApiConfig.getGroupMembers, groupId, params,
  ),
  getGroupDetail: (groupId: string) => withHttpRequestPromise(groupsApiConfig.getGroupDetail, groupId),
  editGroupDetail: (groupId: string, data: IGroupDetailEdit) => withHttpRequestPromise(
    groupsApiConfig.editGroupDetail, groupId, data,
  ),
  getJoinableUsers: (groupId: string, params: any) => withHttpRequestPromise(
    groupsApiConfig.getJoinableUsers, groupId, params,
  ),
  addUsersToGroup: (userIds: string[], groupId: string) => withHttpRequestPromise(
    groupsApiConfig.addUsersToGroup, userIds, groupId,
  ),
  removeGroupMembers: (groupId: string, userIds: string[]) => withHttpRequestPromise(
    groupsApiConfig.removeGroupMembers, groupId, userIds,
  ),
  joinGroup: (groupId: string, params?: MembershipAnswerRequestParam) => withHttpRequestPromise(
    groupsApiConfig.joinGroup, groupId, params,
  ),
  cancelJoinGroup: (groupId: string) => withHttpRequestPromise(groupsApiConfig.cancelJoinGroup, groupId),
  leaveGroup: (groupId: string) => withHttpRequestPromise(groupsApiConfig.leaveGroup, groupId),
  setGroupAdmin: (groupId: string, userId: string) => withHttpRequestPromise(
    groupsApiConfig.setGroupAdmin, groupId, userId,
  ),
  removeGroupAdmin: (groupId: string, userId: string) => withHttpRequestPromise(
    groupsApiConfig.removeGroupAdmin, groupId, userId,
  ),
  getGroupMemberRequests: (groupId: string, params: any) => withHttpRequestPromise(
    groupsApiConfig.getGroupMemberRequests,
    groupId,
    params,
  ),
  approveSingleGroupMemberRequest: (groupId: string, requestId: string) => withHttpRequestPromise(
    groupsApiConfig.approveSingleGroupMemberRequest,
    groupId,
    requestId,
  ),
  approveAllGroupMemberRequests: (groupId: string) => withHttpRequestPromise(
    groupsApiConfig.approveAllGroupMemberRequests,
    groupId,
  ),
  declineSingleGroupMemberRequest: (groupId: string, requestId: string) => withHttpRequestPromise(
    groupsApiConfig.declineSingleGroupMemberRequest,
    groupId,
    requestId,
  ),
  declineAllGroupMemberRequests: (groupId: string) => withHttpRequestPromise(
    groupsApiConfig.declineAllGroupMemberRequests,
    groupId,
  ),
  getDiscoverCommunities: (params?: IParamGetCommunities) => withHttpRequestPromise(
    groupsApiConfig.getDiscoverCommunities, params,
  ),
  searchJoinedCommunities: (params?: IParamGetCommunities) => withHttpRequestPromise(
    groupsApiConfig.searchJoinedCommunities, params,
  ),
  getJoinedCommunities: (params: {
    previewMembers?: boolean;
    managed?: boolean;
    offset?: number;
    limit?: number;
  }) => withHttpRequestPromise(groupsApiConfig.getJoinedCommunities, params),
  getCommunityGroups: (id: string, params: IGetCommunityGroup) => withHttpRequestPromise(
    groupsApiConfig.getCommunityGroups, id, params,
  ),
  getCommunityDetail: (communityId: string) => withHttpRequestPromise(groupsApiConfig.getCommunityDetail, communityId),
  getDiscoverGroups: (communityId: string, params?: IParamGetDiscoverGroups) => withHttpRequestPromise(
    groupsApiConfig.getDiscoverGroups,
    communityId,
    params,
  ),
  joinCommunity: (rootGroupId: string, params?: MembershipAnswerRequestParam) => withHttpRequestPromise(
    groupsApiConfig.joinCommunity, rootGroupId, params,
  ),
  cancelJoinCommunity: (rootGroupId: string) => withHttpRequestPromise(
    groupsApiConfig.cancelJoinCommunity, rootGroupId,
  ),
  leaveCommunity: (rootGroupId: string) => withHttpRequestPromise(groupsApiConfig.leaveCommunity, rootGroupId),
  getCommunities: (params?: IParamGetCommunities) => withHttpRequestPromise(groupsApiConfig.getCommunities, params),
  getJoinedAllGroups: (params: IParamsGetJoinedAllGroups) => withHttpRequestPromise(
    groupsApiConfig.getJoinedAllGroups, params,
  ),
  getOwnerCommunity: () => withHttpRequestPromise(
    groupsApiConfig.getOwnerCommunity,
  ),
  getManagedCommunityAndGroup: (params: IParamsGetManagedCommunityAndGroup) => withHttpRequestPromise(
    groupsApiConfig.getManagedCommunityAndGroup, params,
  ),
  getReportReasons: () => withHttpRequestPromise(groupsApiConfig.getReportReasons),
  getMemberReportReasons: () => withHttpRequestPromise(groupsApiConfig.getMemberReportReasons),
  reportMember: (
    communityId: string,
    params: IParamsReportMember,
  ) => withHttpRequestPromise(
    groupsApiConfig.reportMember,
    communityId,
    params,
  ),
  reportMemberByUserId: (
    userId: string,
    params: IParamsReportMember,
  ) => withHttpRequestPromise(
    groupsApiConfig.reportMemberByUserId,
    userId,
    params,
  ),
  // eslint-disable-next-line max-len
  validateReferralCode: (param: IParamValidateReferralCode) => withHttpRequestPromise(groupsApiConfig.validateReferralCode, param),
  getGroupTerms: (groupId: string) => withHttpRequestPromise(groupsApiConfig.getGroupTerms, groupId),
  getMembershipQuestions: (groupId: string) => withHttpRequestPromise(groupsApiConfig.getMembershipQuestions, groupId),
  getUserNotFoundInfo: (email: string) => withHttpRequestPromise(groupsApiConfig.getUserNotFoundInfo, email),
  getOwnedBadges: () => withHttpRequestPromise(groupsApiConfig.getOwnedBadges),
  putShowingBadges: (badgeIds: string[]) => withHttpRequestPromise(groupsApiConfig.putShowingBadges, badgeIds),
  markNewBadge: (badgeIds: string[]) => withHttpRequestPromise(groupsApiConfig.markNewBadge, badgeIds),
  searchJoinedCommunitiesOnly: (params?: IParamGetCommunities) => withHttpRequestPromise(
    groupsApiConfig.searchJoinedCommunitiesOnly, params,
  ),
};

export default groupApi;
