import { GroupPrivacyType } from '~/constants/privacyTypes';
import { IFilePicked, IGroupSettings } from './common';
import { ResourceUploadType } from './IUpload';
import { RoleType } from '~/constants/permissionScheme';
import { IObject } from '~/interfaces/common';
import { ICommunity, MembershipAnswer } from './ICommunity';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { PostType } from './IPost';

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
  community?: ICommunity;
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
  settings?: IGroupSettings;
  affectedSettings?: IGroupSettings;
  isInDefaultGroupSet?: boolean;
  invitation?: IInvitation;
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
  [FieldNameImageUpload.ICON]?: string;
  backgroundImgUrl?: string;
  [FieldNameImageUpload.BACKGROUND_IMG]?: string;
  privacy?: GroupPrivacyType;
}

export interface IGroupDetail {
  group: IGroup;
  joinStatus: GroupJoinStatus;
}

export interface IParamGetTimeline {
  order?: 'ASC' | 'DESC';
  limit?: number;
  after?: string | null;
  idGte?: number;
  idLte?: number;
  idGt?: number;
  idLt?: number;
  ranking?: 'IMPORTANT' | string;
  isImportant?: boolean;
  isSaved?: boolean;
  isMine?: boolean;
  type?: PostType | undefined;
}

export interface IParamGetGroupMembers {
  key?: string;
  offset?: number;
  limit?: number;
  sort?: string;
}

export enum FieldNameImageUpload {
  // Named by field name in API
  ICON = 'iconId',
  BACKGROUND_IMG = 'backgroundImgId',
}

export interface IGroupImageUpload {
  id: string;
  fieldName: FieldNameImageUpload;
  file: IFilePicked;
  uploadType: ResourceUploadType;
  destination: 'group' | 'community';
  rootGroupId: string;
}

export interface IJoinableUsers {
  id: string;
  username: string;
  fullname: string;
  avatar: string;
}

export interface IParamsGetJoinableUsers {
  groupId: string;
  key: string;
  isLoadMore: boolean;
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
  isVerified?: boolean;
}

export interface IJoiningMember {
  id: string;
  userId: string;
  status: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  user: IJoiningUserInfo;
  noticeMessage?: string;
  membershipAnswers: MembershipAnswer[];
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
  isVerified?: boolean;
}

export interface IGetCommunityGroup {
  previewMembers?: boolean;
  key?: string;
  listBy?: 'tree' | 'flat';
  limit?: number;
  offset?: number;
  includeRootGroup?: boolean;
  sort?: string;
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

export interface IPayloadUpdateGroupJoinSetting {
  groupId: string;
  settings: IGroupSettings;
}
export interface IPayloadPreviewSettings {
  groupId: string;
  settings: IGroupSettings;
}
export interface IPayloadInvitations {
  targetId: string,
  targetType: InvitationsTargetType,
  inviteeIds: string[]
}

export interface IParamsInvitations extends IPayloadInvitations {
  onSuccess: () => void;
  onError: () => void;
}

export enum InvitationsTargetType {
  GROUP = 'GROUP',
  GROUP_SET = 'GROUP_SET',
}

export interface IInvitedPeople {
  id: string,
  inviter: IUserInfo,
  invitee: IUserInfo,
  targetType: InvitationsTargetType,
  targetInfo: IInvitationsTargetInfo,
  status: IInvitationsStatus,
  createdAt: string,
  updatedAt: string | null,
}

interface IUserInfo {
  id: string,
  username: string,
  fullname: string,
  avatar: string,
  isDeactivated: boolean,
}

interface IInvitationsTargetInfo {
  id: string,
  name: string
}

export enum IInvitationsStatus {
  WAITING = 'WAITING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export interface IParamsGetInvitations {
  limit: number,
  offset: number,
}

export interface IInvitation {
  id: string;
  inviter: IUserInfo;
  invitedAt: string;
}

export interface IParamsAcceptSingleInvitation {
  invitationId: string;
  callback: () => void;
}

export interface IParamsDeclineSingleInvitation {
  invitationId: string;
  callback: () => void;
}

export interface IPayloadGetInvitations {
  offset?: number;
  limit?: number;
}
