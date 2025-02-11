import * as React from 'react';
import { IPost } from '~/interfaces/IPost';
import { mockArticle } from '~/test/mock_data/article';
import { mockSeries } from '~/test/mock_data/series';
import { renderWithRedux } from '~/test/testUtils';
import TitleArticle from './TitleItem';

describe('SeriesDetailArticleItem component', () => {
  it('render correctly with role guess', () => {
    const wrapper = renderWithRedux(<TitleArticle
      isActor
      index={1}
      item={mockArticle as IPost}
      seriesId={mockSeries.id}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
