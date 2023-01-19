import {
  ArticleDetail,
  CreateArticle,
  ArticleContentDetail,
  ArticleReviewSchedule,
  ArticleScheduleContent,
} from '~/screens/articles';
import {
  CreateArticleAudience,
  CreateArticleCategory,
  CreateArticleContent,
  CreateArticleCover,
  CreateArticleSeries,
  CreateArticleSummary,
  CreateArticleTitle,
} from '~/screens/articles/CreateArticle/screens';
import CreateArticleTags from '~/screens/articles/CreateArticle/screens/CreateArticleTags';

const articleScreens = {
  'article-detail': ArticleDetail,
  'article-content-detail': ArticleContentDetail,
  'article-review-schedule': ArticleReviewSchedule,
  'article-schedule-content': ArticleScheduleContent,
  'create-article': CreateArticle,
  'create-article-content': CreateArticleContent,
  'create-article-title': CreateArticleTitle,
  'create-article-summary': CreateArticleSummary,
  'create-article-category': CreateArticleCategory,
  'create-article-cover': CreateArticleCover,
  'create-article-audience': CreateArticleAudience,
  'create-article-series': CreateArticleSeries,
  'create-article-tags': CreateArticleTags,
};

export default articleScreens;
