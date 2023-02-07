import { GroupPrivacyType } from '~/constants/privacyTypes';
import { IFilePicked } from './common';
import { IUploadType } from '~/configs/resourceConfig';
import { RoleType } from '~/constants/permissionScheme';
import { IObject } from '~/interfaces/common';

export interface IRole {
  id?: string;
  name?: string;
  scope: string;
  type: RoleType;
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
  privacy?: GroupPrivacyType;
  chatId?: string;
  schemeId?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  userCount?: number;
  teamName?: string;
  isPostable?: boolean;

  communityId?: string;
  children?: IGroup[];
  verified?: boolean;
  parents?: string[] | null;
  ownerId?: string;
  collapsed?: boolean;
  path?: string;
  treeData?: IGroup;
  settings?: {
    isJoinApproval?: boolean;
  };
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
  rootGroupId?: string;
  name?: string;
  description?: string | null;
  icon?: string;
  backgroundImgUrl?: string;
  privacy?: GroupPrivacyType;
}

export interface IGroupDetail {
  group: IGroup;
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
  rootGroupId: string;
}

export interface IGroupGetJoinableMembers {
  groupId: string;
  params?: any;
}

export interface IGroupGetMembers {
  groupId: string;
  isRefreshing?: boolean;
  silentRefresh?: boolean;
  params?: IParamGetGroupMembers;
}

export interface IGroupAddMembers {
  groupId: string;
}

export interface IGroupSetAdmin {
  groupId: string;
  userIds: string[];
}

export interface IGroupRemoveAdmin {
  groupId: string;
  userId: string;
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
  user: IJoiningUserInfo;
  noticeMessage?: string;
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
    currentlyWorkHere: boolean;
    endDate: string | null;
    company: string | null;
    titlePosition: string | null;
  } | null;
}

export interface IGetCommunityGroup {
  previewMembers?: boolean;
  key?: string;
  listBy?: 'tree' | 'flat';
  limit?: number;
  offset?: number;
}

export interface IPayloadGroupSchemeAssignments {
  communityId: string;
  data: { groupId: string; schemeId: string }[];
  currentAssignments?: any;
}

export interface IParamsGetJoinedAllGroups {
  limit?: number;
  offset?: number;
}

export interface IParamsGetManagedCommunityAndGroup {
  limit?: number;
  offset?: number;
}

export interface IPayloadGetGroupStructureCommunityTree {
  communityId: string;
  showLoading?: boolean;
}

export interface IPayloadGetGroupStructureMoveTargets {
    communityId: string;
    groupId: string;
    key?: string;
  }

export interface IPayloadPutGroupStructureMoveToTarget {
    communityId: string;
    moveId: string;
    targetId: string
  }

export interface IPayloadPutGroupStructureReorder {
  communityId: string;
  newOrder: any[];
}

export interface IPayloadGetGroupMemberRequests {
  groupId: string;
  isRefreshing?: boolean;
  params?: any;
}

export interface IPayloadSetGroupMemberRequests {
  total?: number;
  loading?: boolean;
  canLoadMore?: boolean;
  ids?: string[];
  items?: IObject<IJoiningMember>;
}

export interface IPayloadApproveAllGroupMemberRequests {
  groupId: string;
  total: number;
}

export interface IPayloadApproveSingleGroupMemberRequest {
  groupId: string;
  requestId: string;
  fullName: string;
}

export interface IPayloadDeclineAllGroupMemberRequests {
  groupId: string;
  total: number;
  callback?: () => void;
}

export interface IPayloadDeclineSingleGroupMemberRequest {
  groupId: string;
  requestId: string;
  fullName: string;
}
