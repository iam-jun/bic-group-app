import streamApi from '~/api/StreamApi';
import { act, renderHook, waitFor } from '~/test/testUtils';
import useYourQuizStore from '../index';
import { POST_DETAIL } from '~/test/mock_data/post';
import { AttributeQuiz, ContentQuiz } from '~/interfaces/IQuiz';

describe('getQuizzesContent', () => {
  const response = {
    code: 'api.ok',
    data: {
      list: [POST_DETAIL],
      meta: {
        endCursor: 'eyJjcmVhdGVkQXQiOiIyMDIzLTA3LTA5VDE1OjM5OjA1LjE0MloifQ==',
        hasNextPage: true,
      },
    },
  };

  it('should call api getQuizzesContent throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getQuizzesContent').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useYourQuizStore((state) => state));

    act(() => {
      try {
        result.current.actions.getQuizzesContent(true);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    const { attributeFilter, contentFilter, data } = result.current;
    expect(attributeFilter).toBe(AttributeQuiz.DRAFT);
    expect(contentFilter).toBe(ContentQuiz.ALL);
    expect(data.ALL.DRAFT.refreshing).toBe(false);
    expect(data.ALL.DRAFT.loading).toBe(false);
  });

  it('should call api getQuizzesContent when isRefresh = true success', async () => {
    jest.useFakeTimers();

    const spy = jest.spyOn(streamApi, 'getQuizzesContent').mockImplementation(
      () => Promise.resolve(response),
    );

    const { result } = renderHook(() => useYourQuizStore((state) => state));

    act(() => {
      result.current.actions.getQuizzesContent(true);
      jest.advanceTimersByTime(200);
    });

    jest.useRealTimers();

    expect(spy).toBeCalled();

    await waitFor(() => {
      const { attributeFilter, contentFilter, data } = result.current;
      expect(attributeFilter).toBe(AttributeQuiz.DRAFT);
      expect(contentFilter).toBe(ContentQuiz.ALL);
      expect(data.ALL.DRAFT.ids.length).toBe(1);
      expect(data.ALL.DRAFT.hasNextPage).toBe(true);
      expect(data.ALL.DRAFT.loading).toBe(false);
    });
  });
});
