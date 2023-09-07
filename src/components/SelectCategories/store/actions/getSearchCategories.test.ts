import streamApi from '~/api/StreamApi';
import { responseCategory } from '~/test/mock_data/topic';
import { act, renderHook } from '~/test/testUtils';
import useSelectCategoriesStore from '../index';

describe('getSearchCategories in article', () => {
  it('should get list categories success:', () => {
    const spyApiGetCategories = jest.spyOn(streamApi, 'getCategories').mockImplementation(
      () => Promise.resolve(responseCategory) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useSelectCategoriesStore((state) => state));

    act(() => {
      result.current.actions.getSearchCategories('test');
    });

    expect(result.current.search.loading).toBe(true);
    expect(result.current.search.key).toBe('test');
    expect(spyApiGetCategories).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(result.current.search.items.length).toBe(responseCategory.data.list.length);
  });
});
