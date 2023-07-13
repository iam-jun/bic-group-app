import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useTermStore from '../index';

describe('get terms actions', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should get term successfully', () => {
    const response = { data: { content: 'TEST TERMS' } };
    const callBackError = jest.fn();
    const groupId = 'testGroupId';
    const spyCallApi = jest
      .spyOn(groupApi, 'getGroupTerms')
      .mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();

    const { result } = renderHook(() => useTermStore((state) => state));

    expect(result.current.loading).toBeTruthy();

    act(() => {
      result.current.actions.getTerms(groupId, callBackError);
    });

    expect(result.current.loading).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyCallApi).toBeCalled();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.termContent).toEqual(response.data.content);
  });

  it('should get term throw error:', () => {
    const error = 'error';
    const groupId = 'testGroupId';
    const callBackError = jest.fn();

    const spyCallApi = jest
      .spyOn(groupApi, 'getGroupTerms')
      .mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();

    const { result } = renderHook(() => useTermStore((state) => state));

    expect(result.current.loading).toBeTruthy();

    act(() => {
      try {
        result.current.actions.getTerms(groupId, callBackError);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loading).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyCallApi).toBeCalled();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.termContent).toEqual('');
  });

  it('setTermInfo should change store state:', () => {
    const payload = {
      groupId: 'id', rootGroupId: 'groupId', name: 'name', icon: 'icon', privacy: 'privacy', userCount: 1, type: 'community', isActive: true,
    };
    const { result } = renderHook(() => useTermStore((state) => state));
    act(() => {
      result.current.actions.setTermInfo(payload);
    });
    expect(result.current.groupId).toEqual(payload.groupId);
    expect(result.current.rootGroupId).toEqual(payload.rootGroupId);
    expect(result.current.name).toEqual(payload.name);
    expect(result.current.type).toEqual(payload.type);
    expect(result.current.isActiveGroupTerms).toBeTruthy();
  });
});
