import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import { act, renderHook } from '~/test/testUtils';
import useTagDetailStore from '../index';
import { IPayloadGetSearchPosts } from '~/interfaces/IHome';
import { mockArticle } from '~/test/mock_data/article';

describe('getArticlesByTag', () => {
  const payload: IPayloadGetSearchPosts = {
    searchText: '',
    actors: undefined,
    startDate: undefined,
    endDate: undefined,
    groupId: '',
    tagName: 'test',
  };
  it('should do nothing if isLoadMore = true but hasNextPage = false', () => {
    const { result } = renderHook(() => useTagDetailStore((state) => state));
    act(() => {
      result.current.actions.getArticles(payload, true);
    });

    expect(result.current.loading).toBe(true);
  });

  it('should get articles success:', () => {
    const response = {
      code: 200,
      list: [mockArticle] as any,
      data: {
        meta: {
          total: 1,
        },
      },
      meta: {},
    };
    const spy = jest.spyOn(streamApi, 'getSearchPost').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const addToPosts = jest.fn();
    const actions = {
      addToPosts,
    };
    jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useTagDetailStore((state) => state));
    act(() => {
      result.current.actions.getArticles(payload, true);
    });

    expect(result.current.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.articles?.length).toStrictEqual(1);
    expect(result.current.hasNextPage).toBe(false);
    expect(addToPosts).toBeCalledWith({ data: [mockArticle] });
  });

  it('should get articles success with full param value:', () => {
    const response = {
      code: 200,
      list: [mockArticle],
      data: {
        meta: {
          total: 1,
        },
      },
      meta: {},
    };
    const spy = jest.spyOn(streamApi, 'getSearchPost').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const addToPosts = jest.fn();
    const actions = {
      addToPosts,
    };

    const fullPayload: IPayloadGetSearchPosts = {
      searchText: '',
      actors: 'actor_id',
      startDate: '2022-12-20T16:59:59.999Z',
      endDate: '2022-12-20T16:59:59.999Z',
      groupId: 'group_id',
      tagName: 'test',
    };

    jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useTagDetailStore((state) => state));
    act(() => {
      result.current.actions.getArticles(fullPayload);
    });

    expect(result.current.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.articles?.length).toStrictEqual(1);
    expect(result.current.hasNextPage).toBe(false);
    expect(addToPosts).toBeCalledWith({ data: [mockArticle] });
  });

  it('should get articles throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getSearchPost').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useTagDetailStore((state) => state));

    act(() => {
      try {
        result.current.actions.getArticles(payload);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loading).toBe(true);

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
