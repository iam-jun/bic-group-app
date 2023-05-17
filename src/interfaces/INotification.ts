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
}

export interface INotiChangeLogsInfo {
  title: string;
  content: string;
}
