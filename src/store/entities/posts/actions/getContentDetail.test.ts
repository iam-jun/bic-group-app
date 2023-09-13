import { renderHook, waitFor } from '@testing-library/react-native';
import usePostsStore from '../index';
import streamApi from '~/api/StreamApi';
import { PostType } from '~/interfaces/IPost';

describe('getContentDetail', () => {
  it('should getContentDetail error', async () => {
    const spyConsoleError = jest.spyOn(console, 'error');

    const { result } = renderHook(() => usePostsStore());

    result.current.actions.getContentDetail('');

    await waitFor(() => {
      expect(spyConsoleError).toBeCalled();
    });
  });

  it('given PostType.POST should getPostDetail', async () => {
    const spyApiGetPostDetail = jest.spyOn(streamApi, 'getPostDetail').mockImplementation(
      () => Promise.resolve() as any,
    );

    const { result } = renderHook(() => usePostsStore());

    result.current.actions.getContentDetail('123', PostType.POST);

    await waitFor(() => {
      expect(spyApiGetPostDetail).toBeCalled();
    });
  });

  it('given PostType.ARTICLE should getPostDetail', async () => {
    const spyApiGetArticleDetail = jest.spyOn(streamApi, 'getArticleDetail').mockImplementation(
      () => Promise.resolve() as any,
    );

    const { result } = renderHook(() => usePostsStore());

    result.current.actions.getContentDetail('123', PostType.ARTICLE);

    await waitFor(() => {
      expect(spyApiGetArticleDetail).toBeCalled();
    });
  });
});
