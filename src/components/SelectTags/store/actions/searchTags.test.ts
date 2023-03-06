import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { mockGetTagsInArticle, searchTagsRequestParams } from '~/test/mock_data/tags';
import { act, renderHook } from '~/test/testUtils';
import useSelectTagsStore from '../index';

describe('searchTags in article', () => {
  it('should search list tags success:', () => {
    const response = {
      code: 200,
      data: {
        list: mockGetTagsInArticle,
        meta: {
          total: mockGetTagsInArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiSearchTagsByAudiences = jest.spyOn(streamApi, 'searchTagsInAudiences').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useSelectTagsStore((state) => state));
    act(() => {
      result.current.actions.searchTags({ ...searchTagsRequestParams, name: 'test' });
    });

    expect(result.current.search.loading).toBe(true);
    expect(result.current.search.key).toBe('test');
    expect(spyApiSearchTagsByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(result.current.search.items).toBe(mockGetTagsInArticle);
  });

  it('should search tags throw error and should show toast', () => {
    const error = 'internal error';
    const spyApiSearchTagsByAudiences = jest.spyOn(streamApi, 'searchTagsInAudiences').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useSelectTagsStore((state) => state));

    act(() => {
      try {
        result.current.actions.searchTags({ name: 'test' });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.search.loading).toBe(true);
    expect(result.current.search.key).toBe('test');
    expect(spyApiSearchTagsByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(showToast).toBeCalled();
  });
});
