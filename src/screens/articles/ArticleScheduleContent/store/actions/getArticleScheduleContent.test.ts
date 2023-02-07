import { renderHook, act } from '~/test/testUtils';
import streamApi from '~/api/StreamApi';
import { IPayloadGetArticleScheduleContent } from '~/interfaces/IArticle';
import { responseGetArticleScheduleContent } from '../__mocks__/data';
import useArticleScheduleContentStore, { IArticleScheduleContentState } from '../index';

describe('getArticleScheduleContent', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call api get draft articles when isRefresh = true success', () => {
    const payload: IPayloadGetArticleScheduleContent = {
      isRefresh: true,
      groupId: '123',
    };
    const response = responseGetArticleScheduleContent;

    const spy = jest.spyOn(streamApi, 'getArticleScheduleContent').mockImplementation(() => Promise.resolve(response));

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleScheduleContentStore((state) => state));

    act(() => {
      result.current.actions.getArticleScheduleContent(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.articles).toEqual(response.data.list);
    expect(result.current.hasNextPage).toEqual(response.data.meta.hasNextPage);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should call api get draft articles when isRefresh = false success', () => {
    const payload: IPayloadGetArticleScheduleContent = {
      isRefresh: false,
      groupId: '123',
    };
    const response = responseGetArticleScheduleContent;

    const spy = jest.spyOn(streamApi, 'getArticleScheduleContent').mockImplementation(() => Promise.resolve(response));

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleScheduleContentStore((state) => state));

    act(() => {
      result.current.actions.getArticleScheduleContent(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.articles).toEqual(response.data.list);
    expect(result.current.hasNextPage).toEqual(response.data.meta.hasNextPage);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should not call API when isRefresh = false and cannot load more', () => {
    const payload: IPayloadGetArticleScheduleContent = {
      isRefresh: false,
      groupId: '123',
    };
    const spy = jest.spyOn(streamApi, 'getArticleScheduleContent').mockImplementation(() => Promise.resolve({}) as any);

    useArticleScheduleContentStore.setState((state: IArticleScheduleContentState) => {
      state.articles = [];
      state.hasNextPage = false;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleScheduleContentStore((state) => state));

    act(() => {
      result.current.actions.getArticleScheduleContent(payload);
    });
    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call api get draft articles when isRefresh = true and throws error', () => {
    const payload: IPayloadGetArticleScheduleContent = {
      isRefresh: true,
      groupId: '123',
    };
    const error = 'internal error';
    const spy = jest
      .spyOn(streamApi, 'getArticleScheduleContent')
      .mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleScheduleContentStore((state) => state));

    act(() => {
      try {
        result.current.actions.getArticleScheduleContent(payload);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.refreshing).toBe(false);
    expect(result.current.loading).toBe(false);
  });
});
