import * as React from 'react';
import { cleanup } from '@testing-library/react-native';

import TagsView from '.';
import { mockTagsInArticle } from '~/test/mock_data/tags';
import { renderWithRedux } from '~/test/testUtils';

afterEach(cleanup);

describe('TagsView component', () => {
  const data = mockTagsInArticle;
  const onPressTag = jest.fn();

  it('renders correctly', () => {
    const wrapper = renderWithRedux(<TagsView data={data} onPressTag={onPressTag} />);
    const rendered = wrapper.toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
