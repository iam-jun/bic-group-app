import { ArticleDetail, CreateArticle } from '~/screens/articles';
import {
  CreateArticleAudience,
  CreateArticleCategory,
  CreateArticleContent,
  CreateArticleCover,
  CreateArticleSeries,
  CreateArticleSummary,
  CreateArticleTitle,
} from '~/screens/articles/CreateArticle/screens';

const articleScreens = {
  'article-detail': ArticleDetail,
  'create-article': CreateArticle,
  'create-article-content': CreateArticleContent,
  'create-article-title': CreateArticleTitle,
  'create-article-summary': CreateArticleSummary,
  'create-article-category': CreateArticleCategory,
  'create-article-cover': CreateArticleCover,
  'create-article-audience': CreateArticleAudience,
  'create-article-series': CreateArticleSeries,
};

export default articleScreens;
