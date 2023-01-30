import streamApi from '~/api/StreamApi';
import { responseCategory } from '~/test/mock_data/topic';
import { act, renderHook } from '~/test/testUtils';
import useCreateArticleCategoryStore, { ICreateArticleCategoryState } from '../index';

describe('getCategories in article', () => {
  it('should do nothing if hasNextPage = false', () => {
    useCreateArticleCategoryStore.setState((state: ICreateArticleCategoryState) => {
      state.categories.hasNextPage = false;
      return state;
    });

    const { result } = renderHook(() => useCreateArticleCategoryStore((state) => state));
    act(() => {
      result.current.actions.getCategories(true);
    });

    expect(result.current.categories.loading).toBeFalsy();
  });

  it('should get list categories success:', () => {
    const spyApiGetCategories = jest.spyOn(streamApi, 'getCategories').mockImplementation(
      () => Promise.resolve(responseCategory) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCreateArticleCategoryStore((state) => state));

    act(() => {
      result.current.actions.getCategories();
    });

    expect(result.current.categories.loading).toBe(true);
    expect(spyApiGetCategories).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.categories.loading).toBe(false);
    expect(result.current.categories.items.length).toBe(responseCategory.data.list.length);
    expect(result.current.categories.hasNextPage).toBe(false);
  });
});
