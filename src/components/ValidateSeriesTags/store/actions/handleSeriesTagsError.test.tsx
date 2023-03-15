import React from 'react';
import {
  act, fireEvent, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import useValidateSeriesTagsStore from '../index';
import ApiErrorCode from '~/constants/apiErrorCode';
import { HandleSeriesTagsErrorParams } from '..';
import { PostType } from '~/interfaces/IPost';
import useCreatePostStore from '~/screens/post/CreatePost/store';
import AlertModal from '~/beinComponents/modals/AlertModal';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';

describe('handleSeriesTagsError', () => {
  it('should remove series/tags error on post', async () => {
    const errorMock = {
      code: ApiErrorCode.Post.ARTICLE_INVALID_PARAM,
      meta: {
        errors: {
          seriesNames: ['abc', 'xyz'],
          tagNames: ['aaa', 'bbb'],
          seriesIds: ['1', '2'],
          tagIds: ['3', '4'],
        },
      },
    };
    const onNext = jest.fn();
    const params: HandleSeriesTagsErrorParams = {
      error: errorMock,
      onNext,
      postType: PostType.POST,
    };

    const { result } = renderHook(() => useValidateSeriesTagsStore((state) => state));
    const { result: createPostStore } = renderHook(() => useCreatePostStore((state) => state));

    const alertModal = renderWithRedux(<AlertModal />);

    act(() => {
      createPostStore.current.actions.updateCreatePost({
        series: [{ id: '1' }, { id: '2' }, { id: '5' }],
        tags: [{ id: '3' }, { id: '4' }, { id: '6' }],
      });
      result.current.actions.handleSeriesTagsError(params);
    });

    await waitFor(() => {
      const contentModal = alertModal.getByTestId('invalid_series_tags_content_modal');
      expect(contentModal).toBeDefined();
    });

    const btnConfirm = alertModal.getByTestId('alert_modal.confirm');

    act(() => {
      fireEvent.press(btnConfirm);
    });

    expect(createPostStore.current.createPost.series.length).toBe(1);
    expect(createPostStore.current.createPost.tags.length).toBe(1);
    expect(onNext).toBeCalled();
  });

  it('should remove series/tags error on article', async () => {
    const errorMock = {
      code: ApiErrorCode.Post.ARTICLE_INVALID_PARAM,
      meta: {
        errors: {
          seriesNames: ['abc', 'xyz'],
          tagNames: ['aaa', 'bbb'],
          seriesIds: ['1', '2'],
          tagIds: ['3', '4'],
        },
      },
    };
    const onNext = jest.fn();
    const params: HandleSeriesTagsErrorParams = {
      error: errorMock,
      onNext,
      postType: PostType.ARTICLE,
    };

    const { result } = renderHook(() => useValidateSeriesTagsStore((state) => state));
    const { result: createArticleStore } = renderHook(() => useCreateArticleStore((state) => state));

    const alertModal = renderWithRedux(<AlertModal />);

    act(() => {
      useCreateArticleStore.setState((state) => ({
        ...state,
        data: {
          ...state.data,
          series: [{ id: '1' }, { id: '2' }, { id: '5' }],
          tags: [{ id: '3' }, { id: '4' }, { id: '6' }],
        },
      }));
      result.current.actions.handleSeriesTagsError(params);
    });

    await waitFor(() => {
      const contentModal = alertModal.getByTestId('invalid_series_tags_content_modal');
      expect(contentModal).toBeDefined();
    });

    const btnConfirm = alertModal.getByTestId('alert_modal.confirm');

    act(() => {
      fireEvent.press(btnConfirm);
    });

    expect(createArticleStore.current.data.series.length).toBe(1);
    expect(createArticleStore.current.data.tags.length).toBe(1);
    expect(onNext).toBeCalled();
  });
});
