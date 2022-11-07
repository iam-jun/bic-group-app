import {
  ICategory, IEditArticleAudience, IEditArticleData, IParamGetArticleDetail,
} from './IArticle';
import { IArticleCover, IPostCreatePost } from './IPost';

export interface IPostCreateSeries extends IPostCreatePost {
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
