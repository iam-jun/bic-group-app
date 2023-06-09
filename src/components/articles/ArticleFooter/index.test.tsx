import React from 'react';

import {
  createTestStore,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import { IPost } from '~/interfaces/IPost';
import ArticleFooter from '.';
import { mockArticle } from '~/test/mock_data/article';
import initialState from '~/storeRedux/initialState';
import * as navigationHook from '~/hooks/navigation';

describe('ArticleFooter Component', () => {
  const state = { ...initialState };
  const article = mockArticle as IPost;

  it('should hide ReactionView', () => {
    const store = createTestStore(state);

    const rendered = renderWithRedux(
      <ArticleFooter
        articleId={article.id}
        hideReaction
        reactionsCount={[]}
        ownerReactions={[]}
      />, store,
    );

    const reactionView = rendered.queryByTestId('reaction_view');
    expect(reactionView).toBeNull();
  });

  it('should navigate to detail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <ArticleFooter
        articleId={article.id}
        canReact
        hideReaction
        reactionToDetail
        reactionsCount={article.reactionsCount}
        ownerReactions={[]}
      />, store,
    );

    const btnReact = wrapper.queryByTestId('article_footer.btn_react');

    expect(btnReact).not.toBeNull();
    fireEvent.press(btnReact);
    expect(navigate).toBeCalled();
  });

  it('should call onPressComment', () => {
    const onPressComment = jest.fn();

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <ArticleFooter
        articleId={article.id}
        canReact
        canComment
        hideReaction
        reactionsCount={article.reactionsCount}
        ownerReactions={[]}
        commentsCount={article.commentsCount}
        onPressComment={onPressComment}
      />, store,
    );

    const btnComment = wrapper.queryByTestId('content_footer.btn_comment');

    expect(btnComment).not.toBeNull();
    fireEvent.press(btnComment);
    expect(onPressComment).toBeCalled();
  });

  it('should show comment count', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <ArticleFooter
        articleId={article.id}
        canReact
        canComment
        hideReaction
        reactionToDetail
        commentsCount={3}
        reactionsCount={article.reactionsCount}
        ownerReactions={[]}
      />, store,
    );

    const btnCommentText = wrapper.queryByTestId('content_footer.btn_comment.text');

    expect(btnCommentText).not.toBeNull();
    expect(btnCommentText.props.children).toEqual('3 Comment');
  });
});
