import { ILinkPreview } from '~/interfaces/IPost';
import { SortOder } from './common';
import { IOrder } from './IHome';

export interface IParamGetArticles {
  offset?: number;
  limit?: number;
  order?: IOrder;
  important?: boolean;
  idGte?: number;
  idLte?: number;
  idGt?: number;
  idLt?: number;
  created_at_gt?: string,
  created_at_lt?: string,
  created_at_gte?: string,
  created_at_lte?: string,
  categories?: string[],
  series?: string[],
  groupId?: string[],
  orderField?: []
}

export interface IParamGetArticleDetail {
  comment_order?: SortOder;
  child_comment_order?: SortOder;
  comment_limit?: number;
  child_comment_limit?: number;
  offset: number;
  with_comment?: boolean;
}

export interface IParamPutEditArticle {
  articleId: string;
  data: IEditArticleData;
}

export interface IEditArticleAudience {
  userIds: string[];
  groupIds: string[];
}

export interface IEditArticleData {
  title?: string;
  content?: string;
  summary?: string;
  categories?: string[];
  series?: string[];
  hashtags?: string[];
  audience?: IEditArticleAudience;
  media?: any;
  setting?: {
    canShare: boolean,
    canReact: boolean,
    canComment: boolean,
    isImportant: boolean,
    importantExpiredAt: string
  };
  mentions?: any;
  linkPreview?: ILinkPreview;
}
