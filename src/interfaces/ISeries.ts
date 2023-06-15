import {
  ICategory, IEditArticleAudience, IEditArticleData, IParamGetArticleDetail,
} from './IArticle';
import { IArticleCover, IAudience } from './IPost';

export interface IPostCreateSeries {
  title?: string;
  summary?: string;
  categories?: ICategory[];
  audience?: IEditArticleAudience;
  coverMedia?: IArticleCover;
}

export type ISeriesData = IEditArticleData

export interface CreationSeriesProps {
  route?: {
    params?: {
      seriesId?: string;
      isEditAudience?: boolean;
      isFirstStep?: boolean;
      isFromDetail?: boolean;
      initAudienceGroups?: any[];
    };
  };
}

export type IParamGetSeriesDetail= IParamGetArticleDetail;

export interface IGetSeries {
  order?: 'ASC' | 'DESC';
  offset?: number;
  limit?: number;
  idGte?: string;
  idLte?: string;
  idGt?: string;
  idLt?: string;
  createdAtGt?: string;
  createdAtLt?: string;
  createdAtGte?: string;
  createdAtLte?: string;
  contentSearch?: string;
  groupIds?: string[];
  itemIds?: string[];
}

export interface IReorderItems {
  itemIds: string[]
}

export type IAddArticleInSeries = IReorderItems;
export type IRemoveItemInSeries = IReorderItems;

export interface ISeriesSettingsParams {
  seriesId?: string;
  listAudiencesWithoutPermission?: IAudience[];
  isFromSeriesMenuSettings?: boolean;
}
