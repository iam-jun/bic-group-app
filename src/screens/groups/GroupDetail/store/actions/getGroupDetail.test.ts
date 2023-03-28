import groupApi from '~/api/GroupApi';
import useGeneralInformationStore from '~/screens/groups/GeneralInformation/store';
import useGroupsStore from '~/store/entities/groups';
import { groupDetailData } from '~/test/mock_data/group';
import { act, renderHook } from '~/test/testUtils';
import useGroupDetailStore from '../index';

describe('getGroupDetail', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should get group detail success:', () => {
    const response = {
      code: 'api.ok',
      data: { ...groupDetailData },
      meta: { message: 'Success' },
    };

    const spy = jest.spyOn(groupApi, 'getGroupDetail').mockImplementation(() => Promise.resolve(response) as any);

    const setLoadingAvatar = jest.fn();
    const setLoadingCover = jest.fn();
    const actions = {
      setLoadingAvatar,
      setLoadingCover,
    };
    jest.spyOn(useGeneralInformationStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupDetailStore((state) => state));
    act(() => {
      result.current.actions.getGroupDetail({ groupId: groupDetailData.group.id });
    });
    expect(result.current.isLoadingGroupDetailError).toBe(false);
    expect(result.current.loadingGroupDetail).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    const groupDetail = useGroupsStore.getState().groups[groupDetailData.group.id];

    expect(setLoadingAvatar).toBeCalledWith(false);
    expect(setLoadingCover).toBeCalledWith(false);
    expect(result.current.loadingGroupDetail).toBe(false);
    expect(groupDetail).toEqual(response.data);
  });

  it('should get group detail no data', () => {
    const response = null;

    const spy = jest.spyOn(groupApi, 'getGroupDetail').mockImplementation(() => Promise.resolve(response) as any);

    const setLoadingAvatar = jest.fn();
    const setLoadingCover = jest.fn();
    const actions = {
      setLoadingAvatar,
      setLoadingCover,
    };
    jest.spyOn(useGeneralInformationStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupDetailStore((state) => state));
    act(() => {
      result.current.actions.getGroupDetail({ groupId: groupDetailData.group.id });
    });
    expect(result.current.isLoadingGroupDetailError).toBe(false);
    expect(result.current.loadingGroupDetail).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loadingGroupDetail).toBe(false);
  });

  it('should get group detail throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'getGroupDetail').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupDetailStore((state) => state));
    act(() => {
      try {
        result.current.actions.getGroupDetail({ groupId: groupDetailData.group.id });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingGroupDetailError).toBe(true);
    expect(result.current.loadingGroupDetail).toBe(false);
  });
});
