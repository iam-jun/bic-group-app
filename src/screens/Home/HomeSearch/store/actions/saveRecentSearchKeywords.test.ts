import streamApi from '~/api/StreamApi';
import { renderHook, act } from '~/test/testUtils';
import useFeedSearchStore from '../index';

describe('saveRecentSearchKeywords', () => {
  it('should save recent search keyword', () => {
    const spyApiPostNewRecentSearchKeyword = jest.spyOn(streamApi, 'postNewRecentSearchKeyword').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    const { result } = renderHook(() => useFeedSearchStore((state) => state));

    jest.useFakeTimers();

    act(() => {
      result.current.actions.saveRecentSearchKeywords('abc');
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiPostNewRecentSearchKeyword).toBeCalled();
  });

  it('should saveRecentSearchKeywords throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'postNewRecentSearchKeyword').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    jest.useFakeTimers();
    const { result } = renderHook(() => useFeedSearchStore((state) => state));
    act(() => {
      try {
        result.current.actions.saveRecentSearchKeywords('abc');
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
