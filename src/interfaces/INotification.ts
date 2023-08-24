import { IGroup } from './IGroup';

export interface IDeleteNotifications {
  notiGroupIds: string[];
}

export interface IParamGetNotifications {
  limit?: number;
  offset?: number;
  order?: 'ASC' | 'DESC';
  idLte?: string;
  idGte?: string;
  idGt?: string;
  idLt?: string;
  flag?: 'ALL' | 'UNREAD' | 'MENTION' | 'IMPORTANT';
  keyValue?: string;
  isRefresh?: boolean;
}

export interface IParamSetNotifications {
  keyValue?: string;
  data?: any[];
  unseen?: number;
  notifications?: any[];
}

export interface INotificationActivitie {
  id?: string;
  actor?: any;
  meida?: any;
}

export interface ISocketNotification {
  activities?: INotificationActivitie[];
  extra?: {
    type: string;
  };
  id?: string;
  isRead?: boolean;
  isSeen?: boolean;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
  postId?: string;
}

export enum ContentType {
  post = 'post',
  article = 'article',
  series = 'series',
  comment = 'comment',
  childComment = 'child_comment',
}

export interface INotiChangeLogsInfo {
  title: string;
  content: string;
}

export interface INotiChannel {
  inApp?: boolean;
  push?: boolean;
}

export interface IEditNotificationSetting {
  name?: string;
  enable?: boolean;
  channels?: INotiChannel;
}

export interface INotiSettings {
  name: string;
  enable?: boolean;
  order?: number;
  title?: string;
  subtitle?: string;
  child?: INotiSettings[];
  channels?: INotiChannel;
}

export interface IAdvancedNotificationSettings {
  communityId: string;
  id: string;
  groupId?: string;
  name?: string;
  enable?: boolean;
  channels?: INotiChannel;
  flag?: {
    label: string;
    value: boolean;
  }
}

export interface IAdvancedSetting {
  name: string;
  enable: boolean;
  channels?: INotiChannel;
  flag?: {
    label: string;
    value: boolean;
  }
}

export interface IGroupNotificationSetting extends IGroup{
  setting: IAdvancedSetting;
}

export enum InvitationTargetType {
  GROUP = 'GROUP',
  COMMUNITY = 'COMMUNITY',
}

export enum SpecificNotificationType {
  post = 'post',
  article = 'article',
  group = 'group',
}

export interface IParamUpdateSpecificNotificationSettings {
  enable: boolean;
  contentType: SpecificNotificationType;
}
