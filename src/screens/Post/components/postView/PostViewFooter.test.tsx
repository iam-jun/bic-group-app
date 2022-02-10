import React from 'react';
import PostViewFooter from '~/screens/Post/components/postView/PostViewFooter';
import {cleanup, renderWithRedux, store} from '~/test/testUtils';

afterEach(() => {
  cleanup();
  store.clearActions();
});

describe('PostViewFooter component', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(
      <PostViewFooter labelButtonComment={'Comment'} reactionCounts={{}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
