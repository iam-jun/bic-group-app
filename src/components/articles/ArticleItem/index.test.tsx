import React from 'react';

import { act } from 'react-test-renderer';
import {
  createTestStore,
  fireEvent,
  renderHook,
  renderWithRedux,
} from '~/test/testUtils';
import { IPost } from '~/interfaces/IPost';
import ArticleItem from '.';
import { mockArticle } from '~/test/mock_data/article';
import initialState from '~/storeRedux/initialState';
import * as navigationHook from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import tagsStack from '~/router/navigator/MainStack/stacks/tagsStack/stack';
import { mockTagsInArticle } from '~/test/mock_data/tags';
import useCommunitiesStore from '~/store/entities/communities';

describe('ArticleItem Component', () => {
  const state = { ...initialState };
  const article = mockArticle as IPost;

  it('renders correctly', () => {
    const store = createTestStore(state);

    const rendered = renderWithRedux(
      <ArticleItem
        data={article}
      />, store,
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render lite item', () => {
    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <ArticleItem
        isLite
        data={article}
      />, store,
    );

    const footerLite = wrapper.queryByTestId('content_footer_lite');
    const contentInterestedUserCount = wrapper.queryByTestId('article_item.content_interested_user_count');
    const footer = wrapper.queryByTestId('article_footer');

    expect(footerLite).not.toBeNull();
    expect(contentInterestedUserCount).toBeNull();
    expect(footer).toBeNull();
  });

  it('should render highlight', () => {
    const store = createTestStore({ ...initialState });
    const data = { ...article, titleHighlight: '==title== ==highlight==', summaryHighlight: '==summary== ==highlight== 2 ==3==' };

    const wrapper = renderWithRedux(
      <ArticleItem
        isLite
        data={data}
      />, store,
    );

    const title = wrapper.queryByTestId('article_text.title');
    const summary = wrapper.queryByTestId('article_text.summary');

    expect(title.children.length).toEqual(5);
    expect(summary.children.length).toEqual(7);
  });

  it('should navigate to content detail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <ArticleItem
        data={article}
      />, store,
    );

    const btnContent = wrapper.queryByTestId('article_item.btn_content');

    expect(btnContent).not.toBeNull();
    fireEvent.press(btnContent);
    expect(navigate).toBeCalledWith(articleStack.articleContentDetail, { articleId: article.id });
  });

  it('should navigate to detail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <ArticleItem
        isLite
        data={article}
      />, store,
    );

    const commentText = wrapper.queryByTestId('content_footer_lite.comment_text');

    expect(commentText).not.toBeNull();
    fireEvent.press(commentText);
    expect(navigate).toBeCalledWith(articleStack.articleDetail, { articleId: article.id, focusComment: true });
  });

  it('should navigate to tag detail', () => {
    const tagData = mockTagsInArticle[0];
    let communityId = '';

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunitiesStore((state) => state));
    act(() => {
      communityId = result.current.currentCommunityId;
    });
    act(() => {
      jest.runAllTimers();
    });

    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(<ArticleItem isLite data={article} />, store);
    const tagItem = wrapper.queryByTestId(`tag_item_${tagData.id}.button_navigate`);

    expect(tagItem).not.toBeNull();
    fireEvent.press(tagItem);
    expect(navigate).toBeCalledWith(tagsStack.tagDetail, { tagData, communityId });
  });
});
