import { COMMUNITY_PRIVACY_TYPE } from '~/constants/privacyTypes';

export interface ICommunity {
  id: string;
  groupId: string;
  name: string;
  slug: string;
  privacy: COMMUNITY_PRIVACY_TYPE;
  description: string;
  icon: string;
  backgroundImgUrl: string;
  createdAt: string;
  updatedAt: string;
  userCount: number;
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

export type COMMUNITY_ROLE = 'Community Admin' | 'Member';

export interface ICommunityMembers extends IPreviewMember {
  roles: {name: COMMUNITY_ROLE};
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
  privacy?: COMMUNITY_PRIVACY_TYPE;
}
