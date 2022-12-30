import {
  IArticleCover,
  ILinkPreview,
  IParamGetDraftPosts,
} from '~/interfaces/IPost';
import { SortOder } from './common';
import { IOrder } from './IHome';
import { IGetSeries } from './ISeries';

export interface IParamGetArticles {
  offset?: number;
  limit?: number;
  order?: IOrder;
  important?: boolean;
  idGte?: number;
  idLte?: number;
  idGt?: number;
  idLt?: number;
  createdAtGt?: string;
  createdAtLt?: string;
  createdAtGte?: string;
  createdAtLte?: string;
  categories?: string[];
  series?: string[];
  groupId?: string[];
  orderField?: [];
}

export interface IParamGetArticleDetail {
  commentOrder?: SortOder;
  childCommentOrder?: SortOder;
  commentLimit?: number;
  childCommentLimit?: number;
  offset: number;
  withComment?: boolean;
}

export type IParamGetDraftArticles = IParamGetDraftPosts;

export interface IPayloadPublishDraftArticle {
  draftArticleId: string;
  replaceWithDetail?: boolean;
  refreshDraftArticles?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}

export interface IPayloadDeleteArticle {
  id: string;
  isDraft?: boolean;
}

export interface IPayloadPutEditArticle {
  articleId: string;
  data: IEditArticleData;
  isNavigateBack?: boolean;
  isShowToast?: boolean;
}

export interface IParamPutEditArticle
  extends Omit<IEditArticleData, 'categories'> {
  categories: string[];
}

export interface IParamGetCategories {
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  name?: string;
}

export interface IEditArticleAudience {
  userIds: string[];
  groupIds: string[];
}

export interface IEditArticleSeries {
  id?: string;
  title?: string;
}

export interface IEditArticleTags {
  id?: string;
  name?: string;
  slug?: string;
  total?: number;
}

export interface IEditArticleData {
  id?: string;
  title?: string;
  content?: string;
  summary?: string;
  categories?: ICategory[];
  series?: IEditArticleSeries[];
  hashtags?: string[];
  audience?: IEditArticleAudience;
  coverMedia?: IArticleCover;
  setting?: {
    canShare: boolean;
    canReact: boolean;
    canComment: boolean;
    isImportant: boolean;
    importantExpiredAt: string;
  };
  mentions?: any;
  linkPreview?: ILinkPreview;
  tags?: IEditArticleTags[];
}

export interface ICategory {
  id: string;
  name: string;
  parentId?: string;
  level?: number;
  slug?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArticleProps {
  route?: {
    params?: {
      articleId?: string;
      isFromDraftScreen?: boolean;
    };
  };
}

export interface IEditAritcleError {
  ids: string[];
  type: string;
  error: any; // error return from BE
}

export type IGetSearchArticleInSeries = IGetSeries;
export interface IGetSearchTags extends IGetSeries {
  name?: string;
}
