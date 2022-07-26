import { GROUP_PRIVACY_TYPE } from '~/constants/privacyTypes';

export interface ICommunity {
  id: string;
  groupId: string;
  name: string;
  slug: string;
  privacy: GROUP_PRIVACY_TYPE;
  description: string;
  icon: string;
  backgroundImgUrl: string;
  createdAt: string;
  updatedAt: string;
  userCount: number;
  canEditInfo?: boolean;
  canEditPrivacy?: boolean;
  canManageMember?: boolean;
  canManageScheme?: boolean;
  joinStatus?: number;
  members?: IPreviewMember[];
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
}

export interface IParamGetCommunityMembers {
  key?: string;
  offset?: number;
  limit?: number;
}

export type COMMUNITY_ROLE = 'COMMUNITY_ADMIN' | 'COMMUNITY_MEMBER';

export interface ICommunityMembers extends IPreviewMember {
  roles: {name: COMMUNITY_ROLE};
  chatUserId: string;
}

export interface IParamGetDiscoverGroups {
  key?: string;
  offset?: number;
  limit?: number;
  sort?: string;
  preview_members?: boolean;
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
