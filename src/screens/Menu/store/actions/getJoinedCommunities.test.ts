import { act, renderHook } from '~/test/testUtils';
import useMenuController from '../index';
import groupApi from '~/api/GroupApi';

describe('getJoinedCommunities actions', () => {
  it('should get joined communities successfully:', () => {
    const response = { data: [1, 2, 3] };
    const payload = {};
    const spyCallApi = jest
      .spyOn(groupApi, 'getJoinedCommunities')
      .mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();

    const { result } = renderHook(() => useMenuController((state) => state));

    expect(result.current.loading).toBeTruthy();

    act(() => {
      result.current.actions.getJoinedCommunities(payload);
    });

    expect(result.current.loading).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyCallApi).toBeCalled();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.data.length).toEqual(response.data.length);
  });

  it('should get joined communities throw error:', () => {
    const error = 'error';
    const payload = { previewMembers: true, managed: true };
    const spyCallApi = jest
      .spyOn(groupApi, 'getJoinedCommunities')
      .mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();

    const { result } = renderHook(() => useMenuController((state) => state));

    expect(result.current.loading).toBeTruthy();

    act(() => {
      try {
        result.current.actions.getJoinedCommunities(payload);
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
  });
});
