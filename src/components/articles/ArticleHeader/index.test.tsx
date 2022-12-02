import React from 'react';

import {
  createTestStore,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import { IPost } from '~/interfaces/IPost';
import ArticleHeader from '.';
import { mockArticle } from '~/test/mock_data/article';
import initialState from '~/storeRedux/initialState';
import * as navigationHook from '~/hooks/navigation';

describe('ArticleHeader Component', () => {
  const state = { ...initialState };
  const article = mockArticle as IPost;

  it('renders correctly', () => {
    const store = createTestStore(state);

    const rendered = renderWithRedux(
      <ArticleHeader
        data={article}
        actor={article.actor}
      />, store,
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should navigate to detail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <ArticleHeader
        data={article}
        actor={article.actor}
      />, store,
    );

    const btnHeader = wrapper.queryByTestId('content_header');

    expect(btnHeader).not.toBeNull();
    fireEvent.press(btnHeader);
    expect(navigate).toBeCalled();
  });

  it('should call onPressHeader', () => {
    const onPressHeader = jest.fn();

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <ArticleHeader
        data={article}
        actor={article.actor}
        onPressHeader={onPressHeader}
      />, store,
    );

    const btnHeader = wrapper.queryByTestId('content_header');

    expect(btnHeader).not.toBeNull();
    fireEvent.press(btnHeader);
    expect(onPressHeader).toHaveBeenCalled();
  });
});
