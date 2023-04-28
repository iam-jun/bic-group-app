import React from 'react';
import { mockArticle } from '~/test/mock_data/article';
import { IPost } from '~/interfaces/IPost';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ArticleScheduleItem from '.';
import * as navigationHook from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import mainStack from '~/router/navigator/MainStack/stack';

describe('ArticleScheduleItem component', () => {
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
    expect(navigate).toBeCalledWith(articleStack.articleReviewSchedule, { articleId: mockArticle.id, isAdmin: false });

    const tagItem = rendered.getByTestId('audiences.tag_item');
    expect(tagItem).not.toBeNull();
    fireEvent.press(tagItem);
    expect(navigate).toBeCalledWith(mainStack.communityDetail, {
      communityId: mockArticle.audience.groups[0].communityId,
    });

    const tagMoreItem = rendered.getByTestId('audiences.tag_more_item');
    expect(tagMoreItem).not.toBeNull();
    fireEvent.press(tagMoreItem);
  });
});
