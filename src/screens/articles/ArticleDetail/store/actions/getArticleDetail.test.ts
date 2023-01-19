import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useArticlesStore from '../index';
import { mockArticle } from '~/test/mock_data/article';
import usePostsStore from '~/store/entities/posts';

describe('getArticleDetail', () => {
  it('should call api get article detail error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getArticleDetail').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useArticlesStore((state) => state));
    act(() => {
      try {
        result.current.actions.getArticleDetail({ articleId: mockArticle.id });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.requestings[mockArticle.id]).toBeFalsy();
  });

  it('should call api get article detail success', () => {
    const response = {
      data: [mockArticle],
    };

    const addToPosts = jest.fn();
    const actions = {
      addToPosts,
    };
    jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions } as any));

    const spy = jest.spyOn(streamApi, 'getArticleDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useArticlesStore((state) => state));
    act(() => {
      result.current.actions.getArticleDetail({ articleId: mockArticle.id });
    });
    expect(result.current.requestings[mockArticle.id]).toBeTruthy();
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.requestings[mockArticle.id]).toBeFalsy();
    expect(addToPosts).toBeCalledWith({ data: [mockArticle], handleComment: true });
  });
});
