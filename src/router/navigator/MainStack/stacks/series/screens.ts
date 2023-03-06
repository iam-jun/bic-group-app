import {
  ChooseSeriesAudience, CreateStories, SeriesDetail, ReorderItems,
} from '~/screens/series';

const seriesScreens = {
  'series-detail': SeriesDetail,
  'create-series': CreateStories,
  'series-select-audience': ChooseSeriesAudience,
  'reorder-items': ReorderItems,
};

export default seriesScreens;
