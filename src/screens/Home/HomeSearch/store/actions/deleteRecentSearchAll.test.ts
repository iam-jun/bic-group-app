import streamApi from '~/api/StreamApi';
import { renderHook, act } from '~/test/testUtils';
import useFeedSearchStore from '../index';

describe('deleteRecentSearchAll', () => {
  it('should deleteRecentSearchAll', () => {
    const spyApiDeleteCleanRecentSearch = jest.spyOn(streamApi, 'deleteCleanRecentSearch').mockImplementation(
      () => Promise.resolve() as any,
    );

    const { result } = renderHook(() => useFeedSearchStore((state) => state));

    jest.useFakeTimers();

    act(() => {
      result.current.actions.deleteRecentSearchAll('post');
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiDeleteCleanRecentSearch).toBeCalled();
  });
});
