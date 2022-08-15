/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';

import { cleanup } from '@testing-library/react-native';
import i18next from 'i18next';
import initialState from '~/storeRedux/initialState';
import {
  configureStore,
  renderWithRedux,
} from '~/test/testUtils';

import DraftPost from '.';
import { USER_PROFILE } from '~/test/mock_data/menu';
import { LIST_DRAFT_POST } from '~/test/mock_data/draftPosts';

afterEach(cleanup);

describe('UserEditProfile screen', () => {
  const mockStore = configureStore([]);
  let storeData: any;
  jest.useFakeTimers();

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = { ...initialState };

    storeData.auth.user = {} as any;
    storeData.post.draftPosts = {} as any;
  });

  it('should render empty view if posts are empty', async () => {
    const user = {
      signInUserSession: {
        idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
      },
    };
    storeData.auth.user = user as any;
    storeData.post.draftPosts = {
      posts: [],
      canLoadMore: false,
      refreshing: false,
      loading: false,
    };

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<DraftPost />, store);

    const emptyView = wrapper.getByTestId('draft_post.empty_view');
    expect(emptyView).toBeDefined();

    const titleComponent = wrapper.getByTestId('header.text');
    expect(titleComponent).toBeDefined();
    expect(titleComponent.props.children).toBe(i18next.t('home:draft_post'));
  });

  it('should render title with list draft post < 9', async () => {
    const user = {
      signInUserSession: {
        idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
      },
    };
    storeData.auth.user = user as any;
    storeData.post.draftPosts = {
      posts: LIST_DRAFT_POST,
      canLoadMore: false,
      refreshing: false,
      loading: false,
    };

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<DraftPost />, store);

    const titleComponent = wrapper.getByTestId('header.text');
    expect(titleComponent).toBeDefined();
    expect(titleComponent.props.children).toBe(
      `${i18next.t('home:draft_post')} (${LIST_DRAFT_POST.length})`,
    );
  });

  it('should render title with list draft post > 9', async () => {
    const user = {
      signInUserSession: {
        idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
      },
    };
    storeData.auth.user = user as any;
    storeData.post.draftPosts = {
      posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      canLoadMore: false,
      refreshing: false,
      loading: false,
    };

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<DraftPost />, store);

    const titleComponent = wrapper.getByTestId('header.text');
    expect(titleComponent).toBeDefined();
    expect(titleComponent.props.children).toBe(
      `${i18next.t('home:draft_post')} (9+)`,
    );
  });

  it('should render load more if canLoadMore && !refreshing', async () => {
    const user = {
      signInUserSession: {
        idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
      },
    };
    storeData.auth.user = user as any;
    storeData.noInternet.isInternetReachable = true;
    storeData.post.draftPosts = {
      posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      canLoadMore: true,
      refreshing: false,
      loading: false,
    };

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<DraftPost />, store);

    const loadMoreView = wrapper.getByTestId('draft_post.load_more_view');
    expect(loadMoreView).toBeDefined();
  });
});
