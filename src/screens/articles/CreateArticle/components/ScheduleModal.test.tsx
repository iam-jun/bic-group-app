import React from 'react';

import { act, fireEvent, renderWithRedux } from '~/test/testUtils';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost, PostStatus } from '~/interfaces/IPost';
import ScheduleModal from './ScheduleModal';
import useCreateArticleStore from '../store';

describe('ScheduleModal', () => {
  it('should render correctly', () => {
    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ScheduleModal
            articleId={article.id}
          />
        )}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should enable button schedule if date time is set', () => {
    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;
    article.scheduledAt = '2023-01-13T11:00:00.963Z';

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      useCreateArticleStore.getState().actions.setScheduledAt(article.scheduledAt);
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ScheduleModal
            articleId={article.id}
          />
        )}
      />,
    );

    const btn = wrapper.getByTestId('button.content');
    expect(btn).toBeDefined();
    expect(btn.props?.style?.[2]?.backgroundColor).toBe('#7335C0');
  });

  it('should show error if date time is smaller than current', () => {
    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      useCreateArticleStore.getState().actions.setScheduledAt('2023-01-11T11:00:00.963Z');
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ScheduleModal
            articleId={article.id}
          />
        )}
      />,
    );

    const btn = wrapper.getByTestId('button.content');
    expect(btn).toBeDefined();
    fireEvent.press(btn);
    expect(useCreateArticleStore.getState().schedule.errorSubmiting).toBeTruthy();
  });

  it('should show success if schedule success', () => {
    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      useCreateArticleStore.getState().actions.setIsScheduleSubmitingSuccess(true);
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ScheduleModal
            articleId={article.id}
          />
        )}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
