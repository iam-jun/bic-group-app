import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useUserProfileStore from '../index';
import { responseGetCountry } from '../__mocks__/data';

describe('getCountry', () => {
  it('should getCountry success:', () => {
    const spy = jest.spyOn(groupApi, 'getCountry').mockImplementation(() => Promise.resolve(responseGetCountry) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      result.current.actions.getCountry();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.country).toEqual(responseGetCountry.data);
  });

  it('should getCountry throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(groupApi, 'getCountry').mockImplementation(() => Promise.reject(error) as any);

    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    jest.useFakeTimers();
    const { result } = renderHook(() => useUserProfileStore((state) => state));
    act(() => {
      try {
        result.current.actions.getCountry();
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
