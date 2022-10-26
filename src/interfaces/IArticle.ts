import { IArticleCover, ILinkPreview } from '~/interfaces/IPost';
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

export interface IPayloadPutEditArticle {
  articleId: string;
  data: IEditArticleData;
}

export interface IParamPutEditArticle extends Omit<IEditArticleData, 'categories'> {
  categories: string[];
}

export interface IParamGetCategories {
  order?: 'ASC' | 'DESC',
  limit?: number;
  offset?: number;
  name?: string;
}

export interface IEditArticleAudience {
  userIds: string[];
  groupIds: string[];
}

export interface IEditArticleData {
  title?: string;
  content?: string;
  summary?: string;
  categories?: ICategory[];
  series?: string[];
  hashtags?: string[];
  audience?: IEditArticleAudience;
  coverMedia?: IArticleCover;
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

export interface ICategory {
  id: string,
  name: string,
  parentId?: string,
  level?: number,
  slug?: string,
  createdBy?: string,
  createdAt?: string,
  updatedAt?: string,
}

export interface EditArticleProps {
  route?: {
    params?: {articleId: string};
  };
}
