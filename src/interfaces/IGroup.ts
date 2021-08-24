import {GROUP_TYPE, PRIVACY_TYPE} from '~/constants/privacyTypes';
import {IFileResponse} from './common';

export interface IGroup {
  id: number;
  name: string;
  user_count?: number;
  parent?: any;
  parentId?: number;
  children?: IGroup[];
  icon?: string;
  parent_id?: number;
  slug?: string;
  description?: string;
  background_img_url?: string;
  privacy?: string;
  group_type?: GROUP_TYPE;
  verified?: boolean;
  level?: number;
  parents?: number[];
  owner_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  path?: string;
  treeData?: IGroup;
}

export interface IParsedGroup extends IGroup {
  uiId: string;
  parentUiId: string;
  childrenUiIds: string[];
  hide: boolean;
  uiLevel: number;
  isChecked: boolean;
  isCollapsing: boolean;
}

export interface IGroupDetailEdit {
  id?: number;
  parent_id?: number;
  name?: string;
  description?: string;
  level?: number;
  owner_id?: number;
  icon?: string;
  background_img_url?: string;
  group_type?: GROUP_TYPE;
  privacy?: PRIVACY_TYPE;
}

export interface IGroupDetail {
  group: IGroup;
  can_manage_member: boolean;
  can_setting: boolean;
  join_status: number;
}

export interface IGroupImageUpload {
  id: number;
  fieldName: 'icon' | 'background_img_url';
  image: IFileResponse;
}
