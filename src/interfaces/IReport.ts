export interface IReportReason {
  data: IReason[];
  loading: boolean;
}

export interface IReason {
  id?: string;
  value?: string;
}

export enum TargetType {
  POST = 'POST',
  ARTICLE = 'ARTICLE',
  COMMENT = 'COMMENT',
  CHILD_COMMENT = 'CHILD_COMMENT',
  MEMBER = 'MEMBER',
}

export enum ReportTo {
  GROUP = 'GROUP',
  COMMUNITY = 'COMMUNITY',
}

export interface IPayloadReportContent {
  dataComment?: {
    parentCommentId?: string;
    postId?: string;
  };

  targetId: string;
  groupIds: string[];
  targetType: TargetType;
  reportTo: ReportTo;
  reasonType: string;
  reason: string;
  attachment?: string;
}

export interface IParamsReportContent {
  targetId: string;
  groupIds: string[];
  targetType: TargetType;
  reportTo: ReportTo;
  reasonType: string;
  reason: string;
  attachment?: string;
}

export interface IPayloadReportMember {
  targetId: string;
  communityId: string;
  reason: string;
}

export interface IParamsReportMember {
  userId: string;
  reason: string;
}

export interface IReportedContents {
  ids: string[];
  loading: boolean;
  refreshing: boolean,
  hasNextPage: boolean,
}

export interface IParamGetReportContent {
  order: 'ASC' | 'DESC';
  offset: number;
  limit: number;
  targetIds?: string[];
  targetType?: TargetType;
}

export interface IReportDetail {
  total: number;
  reasonType: string;
  description: string;
}
