import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import { listArticle, article } from '../../../test/mock_data/series';
import ListArticle from './ListArticle';
import * as navigationHook from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

describe('ListArticle component', () => {
  it('render correctly', () => {
    const wrapper = renderWithRedux(<ListArticle listArticle={listArticle} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should go to article detail when press article item', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<ListArticle listArticle={listArticle} />);
    const contentComponent = wrapper.getByTestId('list_article.article_item');

    expect(contentComponent).toBeDefined();
    fireEvent.press(contentComponent);
    expect(navigate).toBeCalledWith(articleStack.articleDetail, { articleId: article.id });
  });
});
