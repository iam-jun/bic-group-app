import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useCommunityController from '../index';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('leaveCommunity', () => {
  const communityId = '879c8129-0840-437f-8f23-a7585dc6ba22';

  it('should leave community success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };

    const spy = jest
      .spyOn(groupApi, 'leaveCommunity')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyApiGetManagedCommunityAndGroup = jest
      .spyOn(groupApi, 'getManagedCommunityAndGroup')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyApiGetJoinedCommunities = jest
      .spyOn(groupApi, 'getJoinedCommunities')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityController((state) => state));
    act(() => {
      result.current.actions.leaveCommunity(communityId);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetManagedCommunityAndGroup).toBeCalled();
    expect(spyApiGetJoinedCommunities).toBeCalled();
    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should leave community throw error', () => {
    const error = 'internal error';

    const spy = jest
      .spyOn(groupApi, 'leaveCommunity')
      .mockImplementation(() => Promise.reject(error) as any);

    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityController((state) => state));
    act(() => {
      try {
        result.current.actions.leaveCommunity(communityId);
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
