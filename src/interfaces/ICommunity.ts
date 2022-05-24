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
  can_manage_member?: boolean;
  can_leave?: boolean;
  join_status?: number;
  members?: IPreviewMember[];
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

export type COMMUNITY_ROLE = 'COMMUNITY_ADMIN' | 'MEMBER';

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
  community_admin?: {data: ICommunityMembers[]; user_count: number};
  member?: {data: ICommunityMembers[]; user_count: number};
}
