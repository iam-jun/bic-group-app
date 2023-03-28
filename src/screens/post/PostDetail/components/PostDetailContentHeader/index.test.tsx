import React from 'react';
import initialState from '~/storeRedux/initialState';
import MockedNavigator from '~/test/MockedNavigator';

import { createTestStore, renderWithRedux } from '~/test/testUtils';
import PostDetailContentHeader from './index';

describe('PostDetailContentHeader component', () => {
  const props = {
    id: 'test',
    onPressComment: jest.fn(),
    onContentLayout: jest.fn(),
    commentLeft: 'test',
    idLessThan: 'test',
  };
  it('render correctly', () => {
    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <PostDetailContentHeader {...props} />} />,
      store,
    );
    const { queryByTestId } = wrapper;
    const postView = queryByTestId('post_view');
    expect(postView).toBeDefined();
  });
});
