import * as React from 'react';
import { article } from '~/test/mock_data/series';
import { renderWithRedux } from '~/test/testUtils';
import SeriesDetailArticleItem from '.';

describe('SeriesDetailArticleItem component', () => {
  it('render correctly', () => {
    const wrapper = renderWithRedux(<SeriesDetailArticleItem index={1} article={article} />);
    expect(wrapper).toMatchSnapshot();
  });
});
