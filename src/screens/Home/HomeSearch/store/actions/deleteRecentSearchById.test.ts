import streamApi from '~/api/StreamApi';
import { renderHook, act } from '~/test/testUtils';
import useFeedSearchStore from '../index';

describe('deleteRecentSearchById', () => {
  it('should deleteRecentSearchById', () => {
    const spyApiDeleteRecentSearchById = jest.spyOn(streamApi, 'deleteRecentSearchById').mockImplementation(
      () => Promise.resolve() as any,
    );

    const { result } = renderHook(() => useFeedSearchStore((state) => state));

    jest.useFakeTimers();

    act(() => {
      result.current.actions.deleteRecentSearchById('1');
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiDeleteRecentSearchById).toBeCalled();
  });
});
