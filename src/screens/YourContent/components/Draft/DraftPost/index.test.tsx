/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';

import {
  renderWithRedux,
} from '~/test/testUtils';

import DraftPost from '.';
import useAuthController, { IAuthState } from '~/screens/auth/store';
import { mockDraftPost } from '~/test/mock_data/draftPosts';
import useDraftPostStore from './store';
import IDraftPostState from './store/Interface';
import { IPost } from '~/interfaces/IPost';

const mockData = mockDraftPost as IPost;

describe('UserEditProfile screen', () => {
  it('should render empty view if posts are empty', async () => {
    useAuthController.setState((state:IAuthState) => {
      state.authUser = { userId: 'userId' } as any;
      return state;
    });

    useDraftPostStore.setState((state) => {
      state.hasNextPage = false;
      return state;
    });

    const onScroll = jest.fn();

    const wrapper = renderWithRedux(<DraftPost
      onScroll={onScroll}
    />);

    const emptyView = wrapper.getByTestId('draft_post.empty_view');
    expect(emptyView).toBeDefined();
  });

  it('should render loading view', () => {
    useDraftPostStore.setState((state: IDraftPostState) => {
      state.posts = [] as IPost[];
      state.refreshing = false;
      state.hasNextPage = true;
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<DraftPost
      onScroll={onScroll}
    />);

    const emptyView = rendered.queryByTestId('draft_article.empty_view');
    expect(emptyView).toBeNull();

    const loadingView = rendered.queryByTestId('draft_article.load_more_view');
    expect(loadingView).toBeDefined();
  });

  it('should render ItemSeparator', () => {
    useDraftPostStore.setState((state: IDraftPostState) => {
      state.posts = [mockData] as IPost[];
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<DraftPost
      onScroll={onScroll}
    />);
    const contentView = rendered.getByTestId('draft_post.list');

    expect(rendered).toBeDefined();
    expect(contentView.props.ItemSeparatorComponent()).toBeDefined();
  });
});
