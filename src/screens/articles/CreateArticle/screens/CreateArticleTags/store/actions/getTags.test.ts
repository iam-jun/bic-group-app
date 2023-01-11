import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { mockGetTagsInArticle, searchTagsRequestParams } from '~/test/mock_data/tags';
import { act, renderHook } from '~/test/testUtils';
import useCreateArticleTagsStore, { ICreateArticleTagsState } from '../index';

describe('getTags in article', () => {
  it('should get list tags success:', () => {
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

    const spyApiGetTagsByAudiences = jest.spyOn(streamApi, 'searchTagsInAudiences').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCreateArticleTagsStore((state) => state));
    act(() => {
      result.current.actions.getTags(false, searchTagsRequestParams);
    });

    expect(result.current.listTag.loading).toBe(true);
    expect(spyApiGetTagsByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.listTag.loading).toBe(false);
    expect(result.current.listTag.items).toBe(mockGetTagsInArticle);
    expect(result.current.listTag.hasNextPage).toBe(false);
  });

  it('should load more list tags success:', () => {
    useCreateArticleTagsStore.setState((state: ICreateArticleTagsState) => {
      state.listTag.hasNextPage = true;
      state.listTag.items = [1];
      return state;
    });

    const mockListResponse = [2, 3];

    const response = {
      code: 200,
      data: {
        list: mockListResponse,
        meta: {
          total: mockListResponse.length + 5,
          offset: 1,
        },
      },
      meta: {},
    };

    const spyApiGetTagsByAudiences = jest.spyOn(streamApi, 'searchTagsInAudiences').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCreateArticleTagsStore((state) => state));
    act(() => {
      result.current.actions.getTags(true, searchTagsRequestParams);
    });

    expect(result.current.listTag.loading).toBe(true);
    expect(spyApiGetTagsByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.listTag.loading).toBe(false);
    expect(result.current.listTag.hasNextPage).toBe(true);
    expect(result.current.listTag.items).toStrictEqual([1, 2, 3]);
  });

  it('should get tags throw error and should show toast', () => {
    const error = 'internal error';
    const spyApiGetTagsByAudiences = jest.spyOn(streamApi, 'searchTagsInAudiences').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCreateArticleTagsStore((state) => state));

    act(() => {
      try {
        result.current.actions.getTags(false, searchTagsRequestParams);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.listTag.loading).toBe(true);
    expect(spyApiGetTagsByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.listTag.loading).toBe(false);
    expect(showToast).toBeCalled();
  });

  it('should setListTagLoading action correctly', () => {
    const { result } = renderHook(() => useCreateArticleTagsStore((state) => state));

    act(() => {
      result.current.actions.setListTagLoading(true);
    });
    expect(result.current.listTag.loading).toBe(true);

    act(() => {
      result.current.actions.setListTagLoading(false);
    });
    expect(result.current.listTag.loading).toBe(false);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
