import GroupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useReportContentStore from '../index';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

describe('reportMember', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const payload = {
    reason: 'FAKE',
    targetId: '2cff4f3e-2cad-4d35-a3b0-35f483a22136',
    communityId: '5870fef3-9dd2-4127-85cf-b08e7379f088',
  };

  it('should call api reportMember success and show toast success', () => {
    const response = {
      code: 201,
      data: true,
      meta: {
        message: 'Your report was sent',
      },
    };

    const spy = jest.spyOn(GroupApi, 'reportMember').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));
    act(() => {
      result.current.actions.reportMember(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: response.meta.message,
      type: 'success',
    });
  });

  it('should call api reportMember error and throw error', () => {
    const error = {
      mete: {
        message: 'ERROR',
      },
    };

    const spy = jest.spyOn(GroupApi, 'reportMember').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));
    act(() => {
      result.current.actions.reportMember(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: 'common:text_error_message',
      type: ToastType.ERROR,
    });
  });
});
