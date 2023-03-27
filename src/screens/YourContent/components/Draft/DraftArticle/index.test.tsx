import * as React from 'react';
import { mockArticle } from '~/test/mock_data/article';
import useDraftArticleStore, { IDraftArticleState } from './store';
import { IPost } from '~/interfaces/IPost';
import { renderWithRedux } from '~/test/testUtils';
import DraftArticle from '.';

describe('DraftArticle component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render correctly', () => {
    useDraftArticleStore.setState((state: IDraftArticleState) => {
      state.articles = [mockArticle] as IPost[];
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<DraftArticle
      onScroll={onScroll}
    />);
    const contentView = rendered.getByTestId('draft_article.list');

    expect(rendered.toJSON()).toMatchSnapshot();
    expect(contentView).toBeDefined();
  });

  it('should render empty view', () => {
    useDraftArticleStore.setState((state: IDraftArticleState) => {
      state.articles = [] as IPost[];
      state.hasNextPage = false;
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<DraftArticle
      onScroll={onScroll}
    />);

    const emptyView = rendered.getByTestId('draft_article.empty_view');
    expect(emptyView).toBeDefined();
  });

  it('should not render empty view', () => {
    useDraftArticleStore.setState((state: IDraftArticleState) => {
      state.articles = [] as IPost[];
      state.refreshing = true;
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<DraftArticle
      onScroll={onScroll}
    />);

    const emptyView = rendered.queryByTestId('draft_article.empty_view');
    expect(emptyView).toBeNull();
  });

  it('should render ItemSeparator', () => {
    useDraftArticleStore.setState((state: IDraftArticleState) => {
      state.articles = [mockArticle] as IPost[];
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<DraftArticle
      onScroll={onScroll}
    />);
    const contentView = rendered.getByTestId('draft_article.list');

    expect(rendered).toBeDefined();
    expect(contentView.props.ItemSeparatorComponent()).toBeDefined();
  });
});
