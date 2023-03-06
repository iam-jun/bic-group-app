import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import { listArticle } from '../../../test/mock_data/series';
import ListItem from './ListItem';
import * as navigationHook from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

describe('ListItem component', () => {
  it('should go to article detail when press article item', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<ListItem listItem={listArticle} />);
    const contentComponent = wrapper.getByTestId('list_article.article_item_1');

    expect(contentComponent).toBeDefined();
    fireEvent.press(contentComponent);
    expect(navigate).toBeCalledWith(articleStack.articleContentDetail, { articleId: listArticle[0].id });
  });
});
