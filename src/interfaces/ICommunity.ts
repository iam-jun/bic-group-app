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
  created_at: string;
  updated_at: string;
  user_count: number;
  can_setting: boolean;
  can_manage_member: boolean;
  can_leave: boolean;
  join_status: number;
}

export interface IParamGetCommunityMembers {
  key?: string;
  offset?: number;
  limit?: number;
  sort?: string;
}
