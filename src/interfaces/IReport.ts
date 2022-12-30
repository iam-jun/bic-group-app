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
