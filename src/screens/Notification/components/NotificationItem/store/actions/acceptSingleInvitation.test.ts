import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useGroupDetailStore from '../index';
import { responseAcceptSingleInvitation } from '~/test/mock_data/invitedPeople';
import * as showToastSuccess from '~/store/helper/showToastSuccess';
import * as showToastError from '~/store/helper/showToastError';

describe('acceptSingleInvitation', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const params = {
    invitationId: 'test',
    callback: jest.fn(),
  };

  it('should acceptSingleInvitation success:', () => {
    const spy = jest
      .spyOn(groupApi, 'acceptInvitation')
      .mockImplementation(() => Promise.resolve(responseAcceptSingleInvitation) as any);
    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupDetailStore((state) => state));
    act(() => {
      result.current.actions.acceptSingleInvitation(params);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should acceptSingleInvitation throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'acceptInvitation').mockImplementation(() => Promise.reject(error) as any);
    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupDetailStore((state) => state));
    act(() => {
      try {
        result.current.actions.acceptSingleInvitation(params);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastError).toBeCalled();
  });
});
