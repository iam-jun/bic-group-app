import * as React from 'react';
import { article } from '~/test/mock_data/series';
import { renderWithRedux } from '~/test/testUtils';
import SeriesDetailArticleItem from '.';

describe('SeriesDetailArticleItem component', () => {
  it('render correctly', () => {
    const wrapper = renderWithRedux(<SeriesDetailArticleItem index={1} article={article} seriesId="5264f1b3-c8b8-428a-9fb8-7f075f03d0c8" />);
    expect(wrapper).toMatchSnapshot();
  });
});
