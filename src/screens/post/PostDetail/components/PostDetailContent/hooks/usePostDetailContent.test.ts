import { renderHook } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import streamApi from '~/api/StreamApi';
import APIErrorCode from '~/constants/apiErrorCode';
import useAuthController from '~/screens/auth/store';
import { responsePutMarkSeenPost } from '~/store/entities/posts/__mocks__/data';
import initialState from '~/storeRedux/initialState';
import { POST_DETAIL } from '~/test/mock_data/post';
import { createTestStore, getHookReduxWrapper } from '~/test/testUtils';
import usePostDetailContent from './usePostDetailContent';

describe('usePostDetailContent', () => {
  const props = {
    postId: POST_DETAIL.id,
    notificationId: 'test',
    HeaderImageComponent: 'test',
    isReported: false,
  };

  it('render correctly', () => {
    useAuthController.setState((state) => {
      state.authUser = { userId: 'test' };
      return state;
    });

    const spyPutMarkSeenPost = jest
      .spyOn(streamApi, 'putMarkSeenContent')
      .mockImplementation(() => Promise.resolve(responsePutMarkSeenPost) as any);

    const spyGetPostDetail = jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(responsePutMarkSeenPost) as any);

    const stateData = { ...initialState };
    const store = createTestStore(stateData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(() => usePostDetailContent(props), { wrapper });
    act(() => {
      result.current.onPressMarkSeenPost();
      expect(spyPutMarkSeenPost).toBeCalled();

      result.current.onRefresh();
      expect(spyGetPostDetail).toBeCalled();
    });
  });

  it('render correctly no userId', () => {
    const spyPutMarkSeenPost = jest
      .spyOn(streamApi, 'putMarkSeenContent')
      .mockImplementation(() => Promise.resolve(responsePutMarkSeenPost) as any);

    const stateData = { ...initialState };
    const store = createTestStore(stateData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(() => usePostDetailContent(props), { wrapper });
    act(() => {
      result.current.onPressMarkSeenPost();
      expect(spyPutMarkSeenPost).toBeCalled();
    });
  });

  it('render correctly with errorCode', () => {
    useAuthController.setState((state) => {
      state.authUser = { userId: 'test' };
      return state;
    });

    const spyPutMarkSeenPost = jest
      .spyOn(streamApi, 'putMarkSeenContent')
      .mockImplementation(() => Promise.resolve(responsePutMarkSeenPost) as any);

    const spyGetPostDetail = jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(responsePutMarkSeenPost) as any);

    const stateData = { ...initialState };
    stateData.post.commentErrorCode = APIErrorCode.Post.POST_DELETED;
    const store = createTestStore(stateData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(() => usePostDetailContent(props), { wrapper });
    act(() => {
      result.current.onPressMarkSeenPost();
      expect(spyPutMarkSeenPost).toBeCalled();

      result.current.onRefresh();
      expect(spyGetPostDetail).toBeCalled();
    });
  });
});
