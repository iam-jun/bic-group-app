import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import { listArticle } from '../../../test/mock_data/series';
import ListItem from './ListItem';
import * as navigationHook from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

describe('ListItem component', () => {
  it('should go to article detail when press article item', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<ListItem listItem={listArticle} />);
    const itemCompArticle = wrapper.getByTestId('list_article.article_item_1');

    expect(itemCompArticle).toBeDefined();
    fireEvent.press(itemCompArticle);
    expect(navigate).toBeCalledWith(articleStack.articleContentDetail, { articleId: listArticle[0].id });

    const itemCompPost = wrapper.getByTestId('list_article.article_item_2');

    expect(itemCompPost).toBeDefined();
    fireEvent.press(itemCompPost);
    expect(navigate).toBeCalledWith(homeStack.postDetail, { post_id: listArticle[1].id });
  });
});
