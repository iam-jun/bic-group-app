import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useReportContentStore, { IReportContentState } from '../index';
import { mockReportReason } from '~/test/mock_data/report';

describe('getReportReasons', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should getReportReasons throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'getReportReasons').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useReportContentStore.setState((state: IReportContentState) => {
      state.reportReasons = {} as any;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));

    act(() => {
      try {
        result.current.actions.getReportReasons();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.reportReasons.data).toEqual([]);
  });

  it('should call api getReportReasons success', () => {
    const response = {
      data: mockReportReason,
    };

    const spy = jest.spyOn(groupApi, 'getReportReasons').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useReportContentStore((state) => state));

    act(() => {
      result.current.actions.getReportReasons();
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.reportReasons.data).toEqual(response.data);
  });
});
