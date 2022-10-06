import { CommunityPrivacyType } from '~/constants/privacyTypes';

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
  settings?: { isJoinApproval: boolean; }
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

export interface ICommunityDetailEdit {
  id: string;
  name?: string | null;
  description?: string | null;
  icon?: string;
  backgroundImgUrl?: string;
  privacy?: CommunityPrivacyType;
}
