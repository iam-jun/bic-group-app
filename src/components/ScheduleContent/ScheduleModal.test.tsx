import React from 'react';

import { act, renderWithRedux } from '~/test/testUtils';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost, PostStatus, PostType } from '~/interfaces/IPost';
import ScheduleModal from './ScheduleModal';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import { timeOut } from '~/utils/common';
import useModalStore from '~/store/modal';

describe('ScheduleModal', () => {
  it('should render correctly', () => {
    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    const handleScheduleMock = jest.fn();
    const doAfterScheduleSuccessMock = jest.fn();
    const setDateScheduleMock = jest.fn();
    const setTimeScheduleMock = jest.fn();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ScheduleModal
            contentId={article.id}
            contentType={PostType.ARTICLE}
            handleSchedule={handleScheduleMock}
            doAfterScheduleSuccess={doAfterScheduleSuccessMock}
            setDateSchedule={setDateScheduleMock}
            setTimeSchedule={setTimeScheduleMock}
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

    const handleScheduleMock = jest.fn();
    const doAfterScheduleSuccessMock = jest.fn();
    const setDateScheduleMock = jest.fn();
    const setTimeScheduleMock = jest.fn();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ScheduleModal
            contentId={article.id}
            contentType={PostType.ARTICLE}
            handleSchedule={handleScheduleMock}
            doAfterScheduleSuccess={doAfterScheduleSuccessMock}
            setDateSchedule={setDateScheduleMock}
            setTimeSchedule={setTimeScheduleMock}
          />
        )}
      />,
    );

    const btn = wrapper.getByTestId('button.content');
    expect(btn).toBeDefined();
    expect(btn.props?.style?.[2]?.backgroundColor).toBe('#F4EFFB');
  });

  it('should show success if schedule success', () => {
    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      useCreateArticleStore.getState().actions.setIsScheduleSubmitingSuccess(true);
    });

    const handleScheduleMock = jest.fn();
    const doAfterScheduleSuccessMock = jest.fn();
    const setDateScheduleMock = jest.fn();
    const setTimeScheduleMock = jest.fn();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ScheduleModal
            contentId={article.id}
            contentType={PostType.ARTICLE}
            handleSchedule={handleScheduleMock}
            doAfterScheduleSuccess={doAfterScheduleSuccessMock}
            setDateSchedule={setDateScheduleMock}
            setTimeSchedule={setTimeScheduleMock}
          />
        )}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should closeModal modal after schedule success 3s', async () => {
    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
      useCreateArticleStore.getState().actions.setIsScheduleSubmitingSuccess(true);
    });

    const handleScheduleMock = jest.fn();
    const doAfterScheduleSuccessMock = jest.fn();
    const setDateScheduleMock = jest.fn();
    const setTimeScheduleMock = jest.fn();

    renderWithRedux(
      <MockedNavigator
        component={() => (
          <ScheduleModal
            contentId={article.id}
            contentType={PostType.ARTICLE}
            handleSchedule={handleScheduleMock}
            doAfterScheduleSuccess={doAfterScheduleSuccessMock}
            setDateSchedule={setDateScheduleMock}
            setTimeSchedule={setTimeScheduleMock}
          />
        )}
      />,
    );

    await timeOut(3000);
    expect(useModalStore.getState().modal).toBeNull();
  });
});
