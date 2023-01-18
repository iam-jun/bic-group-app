import React from 'react';
import { mockArticle } from '~/test/mock_data/article';
import { IPost } from '~/interfaces/IPost';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ArticleScheduleItem from '.';
import * as navigationHook from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

describe('ArticleScheduleItem component', () => {
  it('render correctly', () => {
    const rendered = renderWithRedux(
      <ArticleScheduleItem
        data={mockArticle as IPost}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should navigate to ArticleReviewSchedule screen', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any),
    );

    const rendered = renderWithRedux(
      <ArticleScheduleItem
        data={mockArticle as IPost}
      />,
    );
    const btnContent = rendered.getByTestId('article_schedule.btn_content');
    expect(btnContent).not.toBeNull();
    fireEvent.press(btnContent);
    expect(navigate).toBeCalledWith(articleStack.articleReviewSchedule, { articleId: mockArticle.id });
  });
});
