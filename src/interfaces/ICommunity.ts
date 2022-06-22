import {PRIVACY_TYPE} from '~/constants/privacyTypes';

export interface ICommunity {
  id: number;
  group_id: number;
  name: string;
  slug: string;
  privacy: PRIVACY_TYPE;
  description: string;
  icon: string;
  background_img_url: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
  user_count: number;
  can_setting?: boolean;
  can_edit_info?: boolean;
  can_edit_privacy?: boolean;
  can_manage_member?: boolean;
  can_leave?: boolean;
  can_manage_scheme?: boolean;
  join_status?: number;
  members?: IPreviewMember[];
}

export interface IParamGetCommunities {
  key?: string;
  offset?: number;
  limit?: number;
  sort?: string;
  preview_members?: boolean;
}

export interface IPreviewMember {
  id: number;
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
  chat_user_id: string;
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
