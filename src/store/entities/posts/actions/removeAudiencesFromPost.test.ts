import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import usePostsStore, { IPostsState } from '../index';
import { postCreatePost, responsePutEditPost } from '../__mocks__/data';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('removeAudiencesFromPost', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should dont call api putEditPost when id or listAudiences empty', () => {
    const response = responsePutEditPost;

    const spy = jest.spyOn(streamApi, 'putPublishPost').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.removeAudiencesFromPost({} as any);
    });
    expect(spy).not.toBeCalled();
  });

  it('should removeAudiencesFromPost success', () => {
    const response = responsePutEditPost;

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    const spy = jest.spyOn(streamApi, 'putPublishPost').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.removeAudiencesFromPost({
        id: responsePutEditPost.data.id,
        listAudiences: [postCreatePost.audience.groupIds],
      } as any);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should removeAudiencesFromPost failed', () => {
    const error = 'internal error';

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const spy = jest.spyOn(streamApi, 'putPublishPost').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));

    act(() => {
      try {
        result.current.actions.removeAudiencesFromPost({
          id: responsePutEditPost.data.id,
          listAudiences: [postCreatePost.audience.groupIds],
        } as any);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
  });
});
