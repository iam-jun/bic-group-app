import React from 'react';
import { cleanup, renderWithRedux, store } from '~/test/testUtils';
import PostFooter from '.';

afterEach(() => {
  cleanup();
  store.clearActions();
});

describe('PostFooter component', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(
      <PostFooter postId="test-id" labelButtonComment="Comment" reactionsCount={[]} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
