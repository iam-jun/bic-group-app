import {GROUP_TYPE, PRIVACY_TYPE} from '~/constants/privacyTypes';
import {IFilePicked, IObject} from './common';
import {IUploadType} from '~/configs/resourceConfig';

export interface IRole {
  id?: string;
  name?: string;
  scope: string;
  type: string;
  permissions: string[];
}

export interface IPermission {
  key: string;
  name: string;
  description: string;
  scope: string;
  restrictedRoles: string[];
}

export interface IScheme {
  id?: string;
  chatSchemeId?: string;
  scope?: string;
  roles: IRole[];
  name: string;
  description: string;
  isSystem?: boolean;
  usedInsideCommId?: string | number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  applyingGroups?: IApplyingGroups[];
}

export interface IGroupScheme {
  id: string;
  description: string;
  name: string;
  isSystem: boolean;
  applyingGroups: IApplyingGroups[];
}

export interface IApplyingGroups {
  id: number | string;
  name: string;
  description: string | null;
  icon: string;
}

export interface ICategory {
  key: string;
  name: string;
  subCategories: {
    key: string;
    name: string;
    permissions: IPermission[];
  }[];
}

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
  can_setting: boolean;
  can_edit_info?: boolean;
  can_edit_privacy?: boolean;
  can_manage_member?: boolean;
  can_leave?: boolean;
  can_manage_scheme?: boolean;
  join_status: number;
  total_pending_members: number;
}

export interface IParamGetGroupPosts {
  groupId: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  idGte?: number;
  idLte?: number;
  idGt?: number;
  idLt?: number;
  ranking?: 'IMPORTANT' | string;
}

export interface IParamGetGroupMembers {
  key?: string;
  offset?: number;
  limit?: number;
  sort?: string;
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
  isRefreshing?: boolean;
  params?: IParamGetGroupMembers;
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
  chat_user_id?: string;
  is_admin?: boolean;
  custom_role_ids?: any[];
  roles?: any[];
}

export interface IJoiningMember {
  id: number;
  user_id: number;
  group_id: number;
  created_at: string;
  updated_at: string;
  isCanceled?: boolean;
  user: IJoiningUserInfo;
}

export interface IJoiningUserInfo {
  id: number;
  username: string;
  fullname: string;
  email: string;
  avatar: string | null;
  country: string | null;
  city: string | null;
  phone: string | null;
  country_code: string | null;
  latest_work: {
    id: number;
    user_id: number;
    currently_work_here: boolean;
    end_date: string | null;
    company: string | null;
    title_position: string | null;
  } | null;
}

export interface IGetYourGroupsSearch {
  communityId: number;
  key: string;
}

export interface IStateSearch {
  showSearch?: boolean;
  loading?: boolean;
  key?: string;
  list?: any[];
}

export interface IStateList {
  loading?: boolean;
  list?: any[];
  canLoadMore?: boolean;
}

export interface IGetCommunityGroup {
  preview_members?: boolean;
  key?: string;
  list_by?: 'tree' | 'flat';
}
