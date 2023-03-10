import {
  ChooseSeriesAudience,
  CreateStories,
  SeriesDetail,
  ReorderItems,
  SeriesSettings,
} from '~/screens/series';

const seriesScreens = {
  'series-detail': SeriesDetail,
  'create-series': CreateStories,
  'series-select-audience': ChooseSeriesAudience,
  'reorder-items': ReorderItems,
  'series-settings': SeriesSettings,
};

export default seriesScreens;
