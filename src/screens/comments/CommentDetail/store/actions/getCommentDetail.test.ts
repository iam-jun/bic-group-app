import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import streamApi from '~/api/StreamApi';
import APIErrorCode from '~/constants/apiErrorCode';
import { IPayloadGetCommentsById } from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import { responseGetReportContent } from '~/test/mock_data/reportedContents';
import useCommentDetailController from '../index';
import { responseGetCommentDetail } from '../__mock__/data';

describe('getCommentDetail', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should getCommentDetail (isReported = true) success:', () => {
    const payload: IPayloadGetCommentsById = {
      callbackLoading: jest.fn(),
      commentId: responseGetReportContent.data.list[0].id,
      isReported: true,
    };

    const spy = jest
      .spyOn(streamApi, 'getReportContent')
      .mockImplementation(() => Promise.resolve(responseGetReportContent) as any);

    const addToComments = jest.fn();
    const actions = {
      addToComments,
    };
    jest.spyOn(useCommentsStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommentDetailController((state) => state));
    act(() => {
      result.current.actions.getCommentDetail(payload);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(addToComments).toBeCalledWith([{ ...responseGetReportContent.data.list[0] }]);
  });

  it('should getCommentDetail (isReported = false) success:', () => {
    const payload: IPayloadGetCommentsById = {
      callbackLoading: jest.fn(),
      commentId: responseGetCommentDetail.data.list[0].id,
      isReported: false,
    };

    const addToPosts = jest.fn();
    const actions = {
      addToPosts,
    };
    jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions } as any));

    const spy = jest
      .spyOn(streamApi, 'getCommentDetail')
      .mockImplementation(() => Promise.resolve(responseGetCommentDetail) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommentDetailController((state) => state));
    act(() => {
      result.current.actions.getCommentDetail(payload);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(addToPosts).toBeCalled();
  });

  it('should getCommentDetail throw error', () => {
    const payload: IPayloadGetCommentsById = {
      callbackLoading: jest.fn(),
      commentId: responseGetCommentDetail.data.list[0].id,
      isReported: false,
    };

    const error = {
      code: APIErrorCode.Post.POST_PRIVACY,
    };

    const spy = jest.spyOn(streamApi, 'getCommentDetail').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommentDetailController((state) => state));
    act(() => {
      try {
        result.current.actions.getCommentDetail(payload);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });
});
