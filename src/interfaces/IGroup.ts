import {
  GROUP_TYPE,
  GROUP_PRIVACY_TYPE,
  COMMUNITY_PRIVACY_TYPE,
} from '~/constants/privacyTypes';
import { IFilePicked, IObject } from './common';
import { IUploadType } from '~/configs/resourceConfig';

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
  fixedForRoles?: string[];
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
  id: string;
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
  id: string;
  community_id?: string;
  name: string;
  user_count?: number;
  parent?: any;
  parentId?: string;
  children?: IGroup[];
  icon?: string;
  parent_id?: string | null;
  slug?: string;
  description?: string;
  background_img_url?: string | null;
  privacy?: string;
  group_type?: GROUP_TYPE;
  verified?: boolean;
  level?: number;
  parents?: string[] | null;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  chat_id?: string;
  collapsed?: boolean;

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
  id?: string;
  parent_id?: string;
  name?: string;
  description?: string | null;
  level?: number;
  owner_id?: string;
  icon?: string;
  background_img_url?: string;
  group_type?: GROUP_TYPE;
  privacy?: GROUP_PRIVACY_TYPE;
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
  id: string;
  fieldName: 'icon' | 'background_img_url';
  file: IFilePicked;
  uploadType: IUploadType;
  destination: 'group' | 'community';
}

export interface IGroupGetJoinableMembers {
  groupId: string;
  params?: any;
}

export interface IGroupGetMembers {
  groupId: string;
  isRefreshing?: boolean;
  params?: IParamGetGroupMembers;
}

export interface IGroupAddMembers {
  groupId: string;
  userIds: string[];
}

export interface IGroupSetAdmin {
  groupId: string;
  userIds: string[];
}

export interface IGroupRemoveAdmin {
  groupId: string;
  userId: string;
}

export interface IGroupSearchPayload {
  isShow?: boolean;
  loading?: boolean;
  searchKey?: string;
  result?: [];
}

export interface IGroupMembers {
  id?: string;
  username?: string;
  fullname?: string;
  avatar?: string;
  chat_user_id?: string;
  is_admin?: boolean;
  custom_role_ids?: any[];
  roles?: any[];
}

export interface IJoiningMember {
  id: string;
  user_id: string;
  group_id: string;
  created_at: string;
  updated_at: string;
  isCanceled?: boolean;
  user: IJoiningUserInfo;
}

export interface IJoiningUserInfo {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar: string | null;
  country: string | null;
  city: string | null;
  phone: string | null;
  country_code: string | null;
  latest_work: {
    id: string;
    user_id: string;
    currently_work_here: boolean;
    end_date: string | null;
    company: string | null;
    title_position: string | null;
  } | null;
}

export interface IGetYourGroupsSearch {
  communityId: string;
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

export interface ICommunityDetailEdit {
  id: string;
  name?: string | null;
  description?: string | null;
  icon?: string;
  background_img_url?: string;
  privacy?: COMMUNITY_PRIVACY_TYPE;
}
export interface IPayloadGroupSchemeAssignments {
  communityId: string;
  data: {groupId: string; schemeId: string}[];
  currentAssignments?: any;
}
