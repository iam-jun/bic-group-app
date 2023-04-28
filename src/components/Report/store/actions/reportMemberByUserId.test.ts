import GroupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useReportContentStore from '../index';
import { responseReportMemberByUserId } from '~/test/mock_data/report';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('reportMemberByUserId', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const payload = {
    reason: 'FAKE',
    targetId: 'test',
    userId: 'test',
  };

  it('should call api reportMemberByUserId success and show toast success', () => {
    const spy = jest
      .spyOn(GroupApi, 'reportMemberByUserId')
      .mockImplementation(() => Promise.resolve(responseReportMemberByUserId) as any);

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));
    act(() => {
      result.current.actions.reportMemberByUserId(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should call api reportMemberByUserId error and throw error', () => {
    const error = {
      mete: {
        message: 'ERROR',
      },
    };

    const spy = jest.spyOn(GroupApi, 'reportMemberByUserId').mockImplementation(() => Promise.reject(error) as any);

    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));
    act(() => {
      result.current.actions.reportMemberByUserId(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastError).toBeCalled();
  });
});
