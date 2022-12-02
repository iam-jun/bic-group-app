import React from 'react';

import {
  act,
  createTestStore, fireEvent, renderHook, renderWithRedux,
} from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import ArticleContentDetail from './index';
import usePostsStore from '~/store/entities/posts';
import * as navigationHook from '~/hooks/navigation';
import { IPost } from '~/interfaces/IPost';

describe('ArticleContentDetail screen', () => {
  const props = { route: { params: { articleId: mockArticle.id } } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <ArticleContentDetail {...props} />} />,
      store,
    );

    const view = wrapper.queryByTestId('article_content_detail');
    expect(view).not.toBeNull();
  });

  it('should hide ReactionView', () => {
    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <ArticleContentDetail {...props} />} />,
      store,
    );

    const view = wrapper.queryByTestId('reaction_view');
    expect(view).toBeNull();
  });

  it('should navigate to detail', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockArticle as IPost });
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <ArticleContentDetail {...props} />} />,
      store,
    );

    const btnReact = wrapper.queryByTestId('article_footer.btn_react');

    expect(btnReact).not.toBeNull();
    fireEvent.press(btnReact);
    expect(navigate).toBeCalled();
  });

  it('should hide button react', () => {
    const { result } = renderHook(() => usePostsStore());

    const data = { ...mockArticle, setting: { canReact: false } } as IPost;

    act(() => {
      result.current.actions.addToPosts({ data });
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <ArticleContentDetail {...props} />} />,
      store,
    );
    const btnReact = wrapper.queryByTestId('article_footer.btn_react');
    const cannotReactView = wrapper.queryByTestId('content_footer.cannot_reaction_view');

    expect(btnReact).toBeNull();
    expect(cannotReactView).not.toBeNull();
  });
});
