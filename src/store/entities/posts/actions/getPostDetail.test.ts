import streamApi from '~/api/StreamApi';
import useReportContentStore from '~/components/Report/store';
import APIErrorCode from '~/constants/apiErrorCode';
import { POST_DETAIL_4 } from '~/test/mock_data/post';
import { responseGetReportContent } from '~/test/mock_data/reportedContents';
import { act, renderHook, waitFor } from '~/test/testUtils';
import usePostsStore from '../index';

describe('getPostDetail', () => {
  it('given a payload without postId should do nothing', () => {
    const spyApiGetPostDetail = jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve());

    const { result } = renderHook(() => usePostsStore((state) => state));

    act(() => {
      result.current.actions.getPostDetail({} as any);
    });

    expect(spyApiGetPostDetail).not.toBeCalled();
  });

  it('given a payload with postId and isReported = false should get post detail', async () => {
    const res = {
      code: 'api.ok',
      data: POST_DETAIL_4,
      meta: {
        message: 'OK',
      },
    };
    const spyApiGetPostDetail = jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(res) as any);

    const { result } = renderHook(() => usePostsStore((state) => state));

    act(() => {
      result.current.actions.getPostDetail({
        postId: POST_DETAIL_4.id,
      });
    });

    expect(spyApiGetPostDetail).toBeCalled();

    await waitFor(() => {
      expect(result.current.posts[POST_DETAIL_4.id]).toBeDefined();
    });
  });

  it('given a payload with postId and isReported = true should getReportContent', async () => {
    const spyApiGetReportContent = jest
      .spyOn(streamApi, 'getReportContent')
      .mockImplementation(
        () => Promise.resolve(responseGetReportContent) as any,
      );

    const { result } = renderHook(() => usePostsStore((state) => state));
    const { result: resultReportContentStore } = renderHook(() => useReportContentStore((state) => state));

    act(() => {
      result.current.actions.getPostDetail({
        postId: responseGetReportContent.data.list[0].id,
        isReported: true,
      });
    });

    expect(spyApiGetReportContent).toBeCalled();

    await waitFor(() => {
      expect(
        resultReportContentStore.current.reportDetailsPost[
          responseGetReportContent.data.list[0].id
        ],
      ).toBeDefined();
      expect(result.current.posts[responseGetReportContent.data.list[0].id]).toBeDefined();
    });
  });

  it('given a payload with postId that is deleted and isReported = false should get post detail error', async () => {
    const res = {
      code: APIErrorCode.Post.POST_DELETED,
    };

    const spyApiGetPostDetail = jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.reject(res) as any);

    const { result } = renderHook(() => usePostsStore((state) => state));

    usePostsStore.setState((state) => ({
      ...state,
      posts: {
        ...state.posts,
        [POST_DETAIL_4.id]: POST_DETAIL_4 as any,
      },
    }));

    act(() => {
      result.current.actions.getPostDetail({
        postId: POST_DETAIL_4.id,
        showToast: true,
      });
    });

    expect(spyApiGetPostDetail).toBeCalled();

    await waitFor(() => {
      expect(result.current.posts[POST_DETAIL_4.id]).toBeDefined();
      expect(result.current.posts[POST_DETAIL_4.id].deleted).toBeTruthy();
    });
  });
});
