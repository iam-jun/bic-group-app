import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useReportContentStore, { IReportContentState } from '../index';
import { mockReportReason } from '~/test/mock_data/report';

describe('getMemberReportReasons', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should getMemberReportReasons throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'getMemberReportReasons').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useReportContentStore.setState((state: IReportContentState) => {
      state.memberReportReasons = {} as any;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));

    act(() => {
      try {
        result.current.actions.getMemberReportReasons();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.memberReportReasons.data).toEqual([]);
  });

  it('should call api getMemberReportReasons success', () => {
    const response = {
      data: mockReportReason,
    };

    const spy = jest.spyOn(groupApi, 'getMemberReportReasons').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useReportContentStore((state) => state));

    act(() => {
      result.current.actions.getMemberReportReasons();
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.memberReportReasons.data).toEqual(response.data);
  });
});
