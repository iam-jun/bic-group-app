import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useUserProfileStore from '../index';
import { responseGetCity } from '../__mocks__/data';

describe('getCity', () => {
  it('should getCity success:', () => {
    const spy = jest.spyOn(groupApi, 'getCity').mockImplementation(() => Promise.resolve(responseGetCity) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      result.current.actions.getCity();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.city).toEqual(responseGetCity.data);
  });

  it('should getCity throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(groupApi, 'getCity').mockImplementation(() => Promise.reject(error) as any);

    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      try {
        result.current.actions.getCity();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(errorLog).toBeCalled();
  });
});
