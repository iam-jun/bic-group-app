import {
  POST_DETAIL_4, POST_DETAIL_5,
} from '~/test/mock_data/post';
import { act, renderHook } from '~/test/testUtils';
import useCommentsStore from '../../comments';
import usePostsStore from '../index';

describe('addToPosts', () => {
  it('given a post array should add to postsStore', () => {
    const { result } = renderHook(() => usePostsStore((state) => state));
    const { result: resultCommentsStore } = renderHook(() => useCommentsStore((state) => state));

    act(() => {
      result.current.actions.addToPosts({
        data: [POST_DETAIL_4, POST_DETAIL_5] as any,
        handleComment: true,
      });
    });

    expect(result.current.posts[POST_DETAIL_4.id]).toBeDefined();
    expect(result.current.posts[POST_DETAIL_5.id]).toBeDefined();
    expect(
      resultCommentsStore.current.commentsByParentId[POST_DETAIL_4.id],
    ).toBeDefined();
    expect(
      resultCommentsStore.current.commentsByParentId[POST_DETAIL_4.id].length,
    ).toBe(POST_DETAIL_4.comments.list.length);
    expect(
      resultCommentsStore.current.commentsByParentId[POST_DETAIL_5.id],
    ).toBeDefined();
    expect(
      resultCommentsStore.current.commentsByParentId[POST_DETAIL_5.id].length,
    ).toBe((POST_DETAIL_5).comments?.list?.length || 0);
  });

  it('given a post should add to postsStore', () => {
    const { result } = renderHook(() => usePostsStore((state) => state));
    const { result: resultCommentsStore } = renderHook(() => useCommentsStore((state) => state));

    act(() => {
      result.current.actions.addToPosts({
        data: POST_DETAIL_4 as any,
        handleComment: true,
      });
    });

    expect(result.current.posts[POST_DETAIL_4.id]).toBeDefined();
    expect(
      resultCommentsStore.current.commentsByParentId[POST_DETAIL_4.id],
    ).toBeDefined();
    expect(
      resultCommentsStore.current.commentsByParentId[POST_DETAIL_4.id].length,
    ).toBe(POST_DETAIL_4.comments.list.length);
  });
});
