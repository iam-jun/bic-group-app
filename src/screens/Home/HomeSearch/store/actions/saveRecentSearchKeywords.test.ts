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
});
