import { act, renderHook } from '~/test/testUtils';
import useAdvancedNotiSettingsStore from '../index';
import notificationApi from '~/api/NotificationApi';
import { mockCommunityResponse } from '~/test/mock_data/advancedSettings';

describe('get community config setting', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const communityId = '55b974bf-34dd-4f99-af21-d1c79f90aa90';

  it('should get community config success', () => {
    const response = mockCommunityResponse;
    const expectData = {};
    mockCommunityResponse.data.forEach((item: any) => {
      expectData[item.communityId] = { ...item };
    });

    const spyApi = jest.spyOn(notificationApi, 'getCommunitySettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getCommunitySettings(communityId);
    });
    expect(result.current.isLoadingCommunitySettings).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingCommunitySettings).toBeFalsy();
    expect(result.current.communityData).toEqual(expectData);
  });

  it('should get community config success with data = []', () => {
    const response = {
      code: 200,
      data: [],
      meta: {},
    };

    const spyApi = jest.spyOn(notificationApi, 'getCommunitySettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getCommunitySettings(communityId);
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingCommunitySettings).toBeFalsy();
    expect(result.current.communityData).toEqual({});
  });

  it('should get community throw error', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(notificationApi, 'getCommunitySettings').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));

    act(() => {
      try {
        result.current.actions.getCommunitySettings(communityId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingCommunitySettings).toBeFalsy();
    expect(result.current.communityData).toEqual({});
  });
});
