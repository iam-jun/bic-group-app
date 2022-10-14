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
  createdAtGt?: string,
  createdAtLt?: string,
  createdAtGte?: string,
  createdAtLte?: string,
  categories?: string[],
  series?: string[],
  groupId?: string[],
  orderField?: []
}

export interface IParamGetArticleDetail {
  commentOrder?: SortOder;
  childCommentOrder?: SortOder;
  commentLimit?: number;
  childCommentLimit?: number;
  offset: number;
  withComment?: boolean;
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
