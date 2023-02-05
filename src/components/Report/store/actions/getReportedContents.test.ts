import streamApi from '~/api/StreamApi';
import { reportedPostDetail, reportedArticleDetail } from '~/test/mock_data/reportedContents';
import { act, renderHook } from '~/test/testUtils';
import useReportContentStore, { IReportContentState } from '../index';

describe('getReportedContents', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call API to get refresh data successfully', () => {
    const response = {
      data: {
        list: [reportedPostDetail, reportedArticleDetail],
        meta: {
          hasNextPage: true,
        },
      },
    };

    const spy = jest.spyOn(streamApi, 'getReportContent').mockImplementation(
      () => Promise.resolve(response),
    );

    useReportContentStore.setState((state: IReportContentState) => {
      state.reportedContents.ids = [];
      state.reportedContents.loading = false;
      state.reportedContents.refreshing = false;
      state.reportedContents.hasNextPage = false;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));

    act(() => {
      result.current.actions.getReportedContents(true);
    });
    expect(spy).toBeCalled();
    expect(result.current.reportedContents.refreshing).toEqual(true);
    expect(result.current.reportedContents.loading).toEqual(false);
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.reportedContents.loading).toEqual(false);
    expect(result.current.reportedContents.refreshing).toEqual(false);
    expect(result.current.reportedContents.ids).toEqual([reportedPostDetail.id, reportedArticleDetail.id]);
    expect(result.current.reportedContents.hasNextPage).toEqual(true);
  });

  it('should call API to get more data successfully', () => {
    const response = {
      data: {
        list: [reportedPostDetail, reportedArticleDetail],
        meta: {
          hasNextPage: false,
        },
      },
    };

    const spy = jest.spyOn(streamApi, 'getReportContent').mockImplementation(
      () => Promise.resolve(response),
    );
    useReportContentStore.setState((state: IReportContentState) => {
      state.reportedContents.ids = [];
      state.reportedContents.loading = false;
      state.reportedContents.refreshing = false;
      state.reportedContents.hasNextPage = true;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));

    act(() => {
      result.current.actions.getReportedContents(false);
    });
    expect(spy).toBeCalled();
    expect(result.current.reportedContents.refreshing).toEqual(false);
    expect(result.current.reportedContents.loading).toEqual(true);
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.reportedContents.loading).toEqual(false);
    expect(result.current.reportedContents.refreshing).toEqual(false);
    expect(result.current.reportedContents.ids).toEqual([reportedPostDetail.id, reportedArticleDetail.id]);
    expect(result.current.reportedContents.hasNextPage).toEqual(false);
  });

  it('should call API and no data is return', () => {
    const response = {
      data: {
        list: null,
        meta: {
          hasNextPage: false,
        },
      },
    };

    const spy = jest.spyOn(streamApi, 'getReportContent').mockImplementation(
      () => Promise.resolve(response),
    );
    useReportContentStore.setState((state: IReportContentState) => {
      state.reportedContents.ids = [];
      state.reportedContents.loading = false;
      state.reportedContents.refreshing = false;
      state.reportedContents.hasNextPage = true;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));

    act(() => {
      result.current.actions.getReportedContents(false);
    });
    expect(spy).toBeCalled();
    expect(result.current.reportedContents.refreshing).toEqual(false);
    expect(result.current.reportedContents.loading).toEqual(true);
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.reportedContents.loading).toEqual(false);
    expect(result.current.reportedContents.refreshing).toEqual(false);
  });

  it('should call API and throw error', () => {
    const error = {
      meta: {
        message: 'This is error message',
      },
    };

    const spy = jest.spyOn(streamApi, 'getReportContent').mockImplementation(
      () => Promise.reject(error),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));

    act(() => {
      try {
        result.current.actions.getReportedContents(true);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });
});
