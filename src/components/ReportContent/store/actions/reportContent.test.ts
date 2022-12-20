import StreamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useReportContentStore from '../index';
import modalActions from '~/storeRedux/modal/actions';
import { TargetType, ReportTo } from '~/interfaces/IReport';

describe('reportContent', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const payload = {
    groupIds: ['452f371c-58c3-45cb-abca-d68c70b82df2'],
    reason: 'Others',
    reasonType: 'others',
    reportTo: ReportTo.COMMUNITY,
    targetId: 'af0e8e1d-970c-4517-84fb-0b959fe7ca94',
    targetType: TargetType.POST,
  };

  const payloadCmt = {
    groupIds: ['452f371c-58c3-45cb-abca-d68c70b82df2'],
    reason: 'Others',
    reasonType: 'others',
    reportTo: ReportTo.COMMUNITY,
    targetId: 'af0e8e1d-970c-4517-84fb-0b959fe7ca94',
    targetType: TargetType.COMMENT,
  };

  const payloadChildCmt = {
    groupIds: ['452f371c-58c3-45cb-abca-d68c70b82df2'],
    reason: 'Others',
    reasonType: 'others',
    reportTo: ReportTo.COMMUNITY,
    targetId: 'af0e8e1d-970c-4517-84fb-0b959fe7ca94',
    targetType: TargetType.CHILD_COMMENT,
  };

  it('should call api reportContent success and show toast success', () => {
    const response = {
      code: 201,
      data: true,
      meta: {},
    };

    const spy = jest.spyOn(StreamApi, 'reportContent').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));
    act(() => {
      result.current.actions.reportContent(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalledWith({
      content: 'common:text_report_sent',
    });
  });

  it('should call api reportContent success with type COMMNENT', () => {
    const response = {
      code: 201,
      data: true,
      meta: {},
    };

    const spy = jest.spyOn(StreamApi, 'reportContent').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));
    act(() => {
      result.current.actions.reportContent(payloadCmt);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalledWith({
      content: 'common:text_report_sent',
    });
  });

  it('should call api reportContent success with type CHILD COMMNENT', () => {
    const response = {
      code: 201,
      data: true,
      meta: {},
    };

    const spy = jest.spyOn(StreamApi, 'reportContent').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));
    act(() => {
      result.current.actions.reportContent(payloadChildCmt);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalledWith({
      content: 'common:text_report_sent',
    });
  });

  it('should call api reportContent error and throw error', () => {
    const error = {
      mete: {
        message: 'ERROR',
      },
    };

    const spy = jest.spyOn(StreamApi, 'reportContent').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useReportContentStore((state) => state));
    act(() => {
      result.current.actions.reportContent(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalledWith({
      content: 'common:text_error_message',
      props: { type: 'error' },
    });
  });
});
