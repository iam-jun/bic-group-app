import {GROUP_TYPE, PRIVACY_TYPE} from '~/constants/privacyTypes';
import {IFilePicked, IObject} from './common';
import {IUploadType} from '~/configs/resourceConfig';

export interface IGroup {
  id: number;
  name: string;
  user_count?: number;
  parent?: any;
  parentId?: number;
  children?: IGroup[];
  icon?: string;
  parent_id?: number | null;
  slug?: string;
  description?: string;
  background_img_url?: string | null;
  privacy?: string;
  group_type?: GROUP_TYPE;
  verified?: boolean;
  level?: number;
  parents?: number[] | null;
  owner_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  chat_id?: string;

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
  description?: string | null;
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
  total_pending_members: number;
}

export interface IParamGetGroupPosts {
  groupId: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  idGTE?: number;
  idLTE?: number;
  idGT?: number;
  idLT?: number;
  ranking?: 'IMPORTANT' | string;
}

export interface IGroupImageUpload {
  id: number;
  fieldName: 'icon' | 'background_img_url';
  file: IFilePicked;
  uploadType: IUploadType;
}

export interface IGroupGetJoinableMembers {
  groupId: number;
  params?: any;
}

export interface IGroupGetMembers {
  groupId: number;
  params?: any;
}

export interface IGroupAddMembers {
  groupId: number;
  userIds: number[];
}

export interface IGroupSetAdmin {
  groupId: number;
  userIds: number[];
}

export interface IGroupRemoveAdmin {
  groupId: number;
  userId: number;
}

export interface IGroupSearchPayload {
  isShow?: boolean;
  loading?: boolean;
  searchKey?: string;
  result?: [];
}

export interface IGroupMembers {
  id?: number;
  username?: string;
  fullname?: string;
  avatar?: string;
  roles_ids?: number[];
  roles?: IGroupMemberRole[];
}

export interface IGroupMemberRole {
  id: number;
  name: 'Admin' | 'Member';
  type: 'GROUP_ADMIN' | 'MEMBER';
}

export interface IJoiningMember {
  id: number;
  user_id: number;
  group_id: number;
  created_at: string;
  user: IObject<any>;
}
