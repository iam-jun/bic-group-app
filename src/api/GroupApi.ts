import { Method } from 'axios';
import { apiProviders, HttpApiRequestConfig } from '~/api/apiConfig';
import {
  IGetCommunityGroup,
  IGroupDetailEdit,
  IParamGetGroupPosts,
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
import appConfig from '~/configs/appConfig';
import {
  IParamsSignUp, IParamValidateReferralCode, IUserEdit, IVerifyEmail,
} from '~/interfaces/IAuth';
import { IAddWorkExperienceReq } from '~/interfaces/IWorkExperienceRequest';
import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';
import { IParamsReportMember } from '~/interfaces/IReport';
import { ContentType } from '~/components/SelectAudience';

const provider = apiProviders.bein;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
};

export const groupsApiConfig = {
  blockUser: (blockedUserId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${blockedUserId}/block`,
    method: 'post',
  }),
  getCommunityCUDTagPermission: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/permissions/can-cud-tags/community/${communityId}`,
  }),
  updateGroupJoinSetting: (groupId: string, isJoinApproval: boolean): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}groups/${groupId}/settings`,
    method: 'put',
    data: { isJoinApproval },
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
  getUserProfile: (userId: string, params?: any): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${userId}/profile`,
    params,
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
  editMyProfile: (data: IUserEdit): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/profile`,
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

  // todo move to stream
  getGroupPosts: (params?: IParamGetGroupPosts): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${apiProviders.beinFeed.url}feeds/timeline`,
    provider: apiProviders.beinFeed,
    params,
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
  getListBlockingUsers: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/blockings`,
  }),
  getListRelationship: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/blocking-relationships`,
  }),
  unblockUser: (userId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${userId}/unblock`,
    method: 'post',
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
  joinCommunity: (communityId: string, params?: MembershipAnswerRequestParam): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/join`,
    method: 'post',
    data: { ...params },
  }),
  cancelJoinCommunity: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/cancel-joining-request`,
    method: 'put',
  }),
  leaveCommunity: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}communities/${communityId}/leave`,
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
  resendVerificationEmail: (params: IVerifyEmail): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}auth/resend-confirmation-code?email=${params.email}&redirect_page=${params.redirectPage}`,
    method: 'post',
  }),
  validateReferralCode: (param: IParamValidateReferralCode): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}public/referral/verify`,
    params: { ...param },
  }),
  signUp: (params: IParamsSignUp): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}auth/signup/referral`,
    method: 'post',
    data: { ...params },
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
};

const groupApi = {
  blockUser: (blockedUserId: string) => withHttpRequestPromise(groupsApiConfig.blockUser, blockedUserId),
  getCommunityCUDTagPermission: (communityId: string) => withHttpRequestPromise(
    groupsApiConfig.getCommunityCUDTagPermission, communityId,
  ),
  updateGroupJoinSetting: (groupId: string, isJoinApproval: boolean) => withHttpRequestPromise(
    groupsApiConfig.updateGroupJoinSetting, groupId, isJoinApproval,
  ),
  getLinkPreview: (link: string) => withHttpRequestPromise(
    groupsApiConfig.getLinkPreview, link,
  ),
  getUsers: async (params: IParamsGetUsers) => withHttpRequestPromise(
    groupsApiConfig.getUsers, params,
  ),
  getUserProfile: (userId: string, params?: any) => withHttpRequestPromise(
    groupsApiConfig.getUserProfile, userId, params,
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
  editMyProfile: (data: IUserEdit) => withHttpRequestPromise(groupsApiConfig.editMyProfile, data),
  getMyWorkExperience: () => withHttpRequestPromise(groupsApiConfig.getMyWorkExperience),
  addWorkExperience: (data: IAddWorkExperienceReq) => withHttpRequestPromise(
    groupsApiConfig.addWorkExperience, data,
  ),
  editWorkExperience: (id: string, data: IAddWorkExperienceReq) => withHttpRequestPromise(
    groupsApiConfig.editWorkExperience, id, data,
  ),
  deleteWorkExperience: (id: string) => withHttpRequestPromise(
    groupsApiConfig.deleteWorkExperience, id,
  ),
  getWorkExperience: (id: string) => withHttpRequestPromise(
    groupsApiConfig.getWorkExperience, id,
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
  getGroupPosts: (param: IParamGetGroupPosts) => withHttpRequestPromise(
    groupsApiConfig.getGroupPosts, {
      offset: param?.offset || 0,
      limit: param?.limit || appConfig.recordsPerPage,
      ...param,
    },
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
  getListBlockingUsers: () => withHttpRequestPromise(groupsApiConfig.getListBlockingUsers),
  getListRelationship: () => withHttpRequestPromise(groupsApiConfig.getListRelationship),
  unblockUser: (userId: string) => withHttpRequestPromise(groupsApiConfig.unblockUser, userId),
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
  joinCommunity: (communityId: string, params?: MembershipAnswerRequestParam) => withHttpRequestPromise(
    groupsApiConfig.joinCommunity, communityId, params,
  ),
  cancelJoinCommunity: (communityId: string) => withHttpRequestPromise(
    groupsApiConfig.cancelJoinCommunity, communityId,
  ),
  leaveCommunity: (communityId: string) => withHttpRequestPromise(groupsApiConfig.leaveCommunity, communityId),
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
  resendVerificationEmail: (params: IVerifyEmail) => withHttpRequestPromise(
    groupsApiConfig.resendVerificationEmail, params,
  ),
  // eslint-disable-next-line max-len
  validateReferralCode: (param: IParamValidateReferralCode) => withHttpRequestPromise(groupsApiConfig.validateReferralCode, param),
  signUp: (params: IParamsSignUp) => withHttpRequestPromise(groupsApiConfig.signUp, params),
  getGroupTerms: (groupId: string) => withHttpRequestPromise(groupsApiConfig.getGroupTerms, groupId),
  getMembershipQuestions: (groupId: string) => withHttpRequestPromise(groupsApiConfig.getMembershipQuestions, groupId),
  getUserNotFoundInfo: (email: string) => withHttpRequestPromise(groupsApiConfig.getUserNotFoundInfo, email),
};

export default groupApi;
