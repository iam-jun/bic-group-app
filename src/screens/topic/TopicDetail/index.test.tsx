import * as React from 'react';
import { mockTopic } from '~/test/mock_data/topic';
import { renderWithRedux } from '~/test/testUtils';
import TopicDetail from './index';

describe('SeriesDetailArticleItem component', () => {
  it('render correctly', () => {
    const wrapper = renderWithRedux(<TopicDetail route={{ params: { topicId: mockTopic.id } }} />);
    expect(wrapper).toMatchSnapshot();
  });
});
