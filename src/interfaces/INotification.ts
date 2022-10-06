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
