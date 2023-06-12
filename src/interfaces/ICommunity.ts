import { CommunityPrivacyType } from '~/constants/privacyTypes';
import { IGroupSettings, IObject } from '~/interfaces/common';
import { IJoiningMember } from '~/interfaces/IGroup';

export interface ICommunity {
  id: string;
  groupId: string;
  name: string;
  slug: string;
  privacy: CommunityPrivacyType;
  description: string;
  icon: string;
  backgroundImgUrl: string;
  createdAt: string;
  updatedAt: string;
  userCount: number;
  joinStatus?: number;
  members?: IPreviewMember[];
  teamName?: string;
  settings?: IGroupSettings;
  affectedSettings?: IGroupSettings;
}

export interface IParamGetCommunities {
  key?: string;
  offset?: number;
  limit?: number;
  sort?: string;
  previewMembers?: boolean;
}

export interface IPreviewMember {
  id: string;
  username: string;
  fullname: string;
  avatar: string;
  isVerified?: boolean;
}

export interface ICommunityMembers extends IPreviewMember {
  roles: {name: string};
  chatUserId: string;
  isAdmin?: boolean;
}

export interface IParamGetDiscoverGroups {
  key?: string;
  offset?: number;
  limit?: number;
  sort?: string;
  previewMembers?: boolean;
}

export interface IPayloadGetDiscoverGroups{
  communityId: string;
  isRefreshing?: boolean;
  params?: IParamGetDiscoverGroups;
}

export interface ISetMembers {
  loading?: boolean;
  canLoadMore?: boolean;
  offset?: number;
  [roleName: string]: any;
}

export interface ISetCommunitySearchMembers {
  loading?: boolean;
  canLoadMore?: boolean;
  data?: ICommunityMembers[];
}

export interface IPayloadGetCommunityMemberRequests {
  groupId: string;
  isRefreshing?: boolean;
  params?: any
}

export interface IPayloadApproveSingleCommunityMemberRequest {
  communityId: string;
  groupId: string;
  requestId: string;
  fullName: string;
}

export interface IPayloadApproveAllCommunityMemberRequest {
  communityId: string;
  groupId: string;
  total: number;
}

export interface IPayloadSetCommunityMemberRequests {
  total?: number;
  loading?: boolean;
  canLoadMore?: boolean;
  ids?: string[];
  items?: IObject<IJoiningMember>;
}

export interface IPayloadDeclineSingleCommunityMemberRequest {
  groupId: string;
  requestId: string;
  fullName: string;
}

export interface IPayloadDeclineAllCommunityMemberRequests {
  groupId: string;
  total:number;
}

export interface IRemoveCommunityMember {
  communityId: string,
  groupId: string,
  userId: string,
}

export interface ISearchCommunityMembers {
  key: string,
  groupId: string,
  isLoadMore?: boolean,
}

export interface MembershipAnswer {
  question: string,
  answer: string,
  isRequired: boolean,
}
export interface IMembershipQuestion {
  id: string,
  groupId: string,
  question: string,
  isRequired: boolean,
  createdAt: string,
  updatedAt: string,
}

export interface MembershipAnswerRequest{
  questionId: string,
  answer: string
}

export interface MembershipAnswerRequestParam {
  membershipAnswers: MembershipAnswerRequest[],
}

export interface IRequestJoinCommunity {
  communityId: string,
  communityName: string,
  membershipAnswers?: MembershipAnswerRequest[],
}
