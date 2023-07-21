import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useDraftQuizStore, { IDraftQuizState } from '../../../../YourContent/components/Quiz/store/index';
import { postWithQuiz } from '~/test/mock_data/quiz';

describe('getDraftQuiz', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const response = {
    code: 'api.ok',
    data: {
      list: [postWithQuiz],
      meta: {
        endCursor: 'eyJjcmVhdGVkQXQiOiIyMDIzLTA3LTA5VDE1OjM5OjA1LjE0MloifQ==',
        hasNextPage: true,
      },
    },
  };

  it('should call api getDraftQuiz throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getDraftQuiz').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftQuizStore((state) => state));

    act(() => {
      try {
        result.current.actions.getDraftQuiz(true);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.draftQuiz.refreshing).toBe(false);
    expect(result.current.draftQuiz.loading).toBe(false);
  });

  it('should call api getDraftQuiz when isRefresh = true success', () => {
    const spy = jest.spyOn(streamApi, 'getDraftQuiz').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftQuizStore((state) => state));

    act(() => {
      result.current.actions.getDraftQuiz(true);
    });
    expect(result.current.draftQuiz.refreshing).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.draftQuiz.data).toEqual(response.data.list);
    expect(result.current.draftQuiz.hasNextPage).toBe(true);
    expect(result.current.draftQuiz.refreshing).toBe(false);
    expect(result.current.draftQuiz.loading).toBe(false);
  });

  it('should call api getDraftQuiz when isRefresh = false success', () => {
    useDraftQuizStore.setState((state: IDraftQuizState) => {
      state.draftQuiz.data = [postWithQuiz] as any;
      return state;
    });
    const spy = jest.spyOn(streamApi, 'getDraftQuiz').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftQuizStore((state) => state));

    act(() => {
      result.current.actions.getDraftQuiz(false);
    });
    expect(result.current.draftQuiz.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.draftQuiz.data.length).toBe(2);
    expect(result.current.draftQuiz.refreshing).toBe(false);
    expect(result.current.draftQuiz.loading).toBe(false);
  });
});
