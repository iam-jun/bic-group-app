import { ArticleDetail, EditArticle } from '~/screens/articles';
import EditAudience from '~/screens/articles/EditArticle/EditAudience';
import EditCategory from '~/screens/articles/EditArticle/EditCategory';
import EditContent from '~/screens/articles/EditArticle/EditContent';
import EditCover from '~/screens/articles/EditArticle/EditCover';
import EditArticleSeries from '~/screens/articles/EditArticle/EditSeries';
import EditSummary from '~/screens/articles/EditArticle/EditSummary';
import EditTitle from '~/screens/articles/EditArticle/EditTitle';

const articleScreens = {
  'edit-article': EditArticle,
  'edit-article-content': EditContent,
  'edit-article-title': EditTitle,
  'edit-article-summary': EditSummary,
  'edit-article-category': EditCategory,
  'edit-article-cover': EditCover,
  'edit-article-audience': EditAudience,
  'article-detail': ArticleDetail,
  'edit-article-series': EditArticleSeries,
};

export default articleScreens;
