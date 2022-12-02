import * as React from 'react';
import { article } from '~/test/mock_data/topic';
import { renderWithRedux } from '~/test/testUtils';
import TopicDetailArticleItem from './index';

describe('SeriesDetailArticleItem component', () => {
  it('render correctly', () => {
    const wrapper = renderWithRedux(<TopicDetailArticleItem article={article} />);
    expect(wrapper).toMatchSnapshot();
  });
});
