import React from 'react';
import { cleanup, renderWithRedux, store } from '~/test/testUtils';
import PostViewFooter from './PostViewFooter';

afterEach(() => {
  cleanup();
  store.clearActions();
});

describe('PostViewFooter component', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(
      <PostViewFooter labelButtonComment="Comment" reactionCounts={{}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
