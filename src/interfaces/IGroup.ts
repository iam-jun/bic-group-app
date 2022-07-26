import { GROUP_PRIVACY_TYPE } from '~/constants/privacyTypes';
import { IFilePicked } from './common';
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
  parentId?: string;
  name: string;
  slug?: string;
  description?: string;
  level?: number;
  parent?: any;
  createdBy?: string;
  icon?: string;
  backgroundImgUrl?: string | null;
  privacy?: string;
  chatId?: string;
  schemeId?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  userCount?: number;
  teamName?: string;

  communityId?: string;
  children?: IGroup[];
  verified?: boolean;
  parents?: string[] | null;
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
  parentId?: string;
  name?: string;
  description?: string | null;
  level?: number;
  icon?: string;
  backgroundImgUrl?: string;
  privacy?: GROUP_PRIVACY_TYPE;
}

export interface IGroupDetail {
  group: IGroup;
  canEditInfo?: boolean;
  canEditPrivacy?: boolean;
  canManageMember?: boolean;
  joinStatus: number;
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
  fieldName: 'icon' | 'backgroundImgUrl';
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
  chatUserId?: string;
  isAdmin?: boolean;
  customRoleIds?: any[];
  roles?: any[];
}

export interface IJoiningMember {
  id: string;
  userId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
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
  countryCode: string | null;
  latestWork: {
    id: string;
    userId: string;
    currently_work_here: boolean;
    end_date: string | null;
    company: string | null;
    titlePosition: string | null;
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
  previewMembers?: boolean;
  key?: string;
  list_by?: 'tree' | 'flat';
}

export interface IPayloadGroupSchemeAssignments {
  communityId: string;
  data: {groupId: string; schemeId: string}[];
  currentAssignments?: any;
}
