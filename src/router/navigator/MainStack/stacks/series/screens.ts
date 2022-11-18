import {
  ChooseSeriesAudience, CreateStories, SeriesDetail, ReorderArticles,
} from '~/screens/series';

const seriesScreens = {
  'series-detail': SeriesDetail,
  'create-series': CreateStories,
  'series-select-audience': ChooseSeriesAudience,
  'reorder-articles': ReorderArticles,
};

export default seriesScreens;
