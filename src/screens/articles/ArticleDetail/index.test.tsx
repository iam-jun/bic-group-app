import React from 'react';

import {
  act, createTestStore, renderHook, renderWithRedux,
} from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import ArticleDetail from './index';
import * as useMounted from '~/hooks/mounted';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';
import { mockViewContentJoinRequire } from '~/test/mock_data/post';

describe('ArticleDetail screen', () => {
  const props = { route: { params: { articleId: mockArticle.id } } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render placeholder when not mounted', () => {
    jest.spyOn(useMounted, 'default').mockImplementation(() => (false));

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <ArticleDetail {...props} />} />,
      store,
    );

    const placeholder = wrapper.queryByTestId('article_detail.placeholder');
    expect(placeholder).not.toBeNull();
  });

  it('should not render placeholder when has data', () => {
    jest.spyOn(useMounted, 'default').mockImplementation(() => (true));
    const { result } = renderHook(() => usePostsStore());
    act(() => {
      result.current.actions.addToPosts({ data: mockArticle as IPost });
    });

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <ArticleDetail {...props} />} />,
      store,
    );

    const placeholder = wrapper.queryByTestId('article_detail.placeholder');
    expect(placeholder).toBeNull();

    const view = wrapper.queryByTestId('article_detail');
    expect(view).not.toBeNull();
  });

  it('should render ContentNoPermission', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToErrorContents(mockArticle.id, {
        isError: true,
        code: mockViewContentJoinRequire.code,
        message: mockViewContentJoinRequire.meta.message,
        requireGroups: mockViewContentJoinRequire.meta.errors.requireGroups,
      });
    });

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <ArticleDetail {...props} />} />,
      store,
    );

    const viewContentNoPermission = wrapper.getByTestId('content_no_permission');
    expect(viewContentNoPermission).toBeDefined();
  });

  it('should render ContentUnavailable', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToErrorContents(mockArticle.id, {
        isError: true,
        code: '',
        message: '',
        requireGroups: [],
      });
    });

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <ArticleDetail {...props} />} />,
      store,
    );

    const viewUnsupportFeature = wrapper.getByTestId('unsupport_feature');
    expect(viewUnsupportFeature).toBeDefined();
  });
});
