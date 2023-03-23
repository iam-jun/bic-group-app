import React from 'react';

import {
  createTestStore,
  fireEvent,
  languages,
  renderWithRedux,
} from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import PostView from '~/components/posts/PostView';
import { POST_DETAIL, POST_DETAIL_2 } from '~/test/mock_data/post';
import * as navigationHook from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { IPost } from '~/interfaces/IPost';
import useModalStore from '~/store/modal';

describe('PostView Component', () => {
  const state: any = { ...initialState };
  state.post.allPosts = { [POST_DETAIL.id]: POST_DETAIL } as any;
  const postData = POST_DETAIL as unknown as IPost;

  it('renders deleted post', async () => {
    const stateData: any = { ...state };
    stateData.post.allPosts = {
      [POST_DETAIL.id]: { ...POST_DETAIL, deleted: true },
    } as any;
    const store = createTestStore(stateData);
    const wrapper = renderWithRedux(
      <PostView data={postData} />,
      store,
    );
    const labelDeleted = wrapper.queryByTestId('post_view.label_deleted');
    expect(labelDeleted).toBeDefined();
    expect(labelDeleted?.children?.[0]).toBe(languages.post.label_post_deleted);
  });

  it('renders important', async () => {
    const stateData: any = { ...state };
    stateData.post.allPosts = {
      [POST_DETAIL.id]: {
        ...POST_DETAIL,
        setting: {
          isImportant: true,
          importantExpiredAt: '2030-04-20T11:07:08.129Z',
        },
      },
    } as any;
    const store = createTestStore(stateData);
    const wrapper = renderWithRedux(
      <PostView data={postData} />,
      store,
    );
    const importantStatus = wrapper.queryByTestId('important_status');
    const importantStatusLite = wrapper.queryByTestId(
      'post_view.important_status_lite',
    );
    expect(importantStatus || importantStatusLite).not.toBeNull();
  });

  it('renders correctly post view lite', async () => {
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView isLite data={postData} />,
      store,
    );
    const footerView = wrapper.queryByTestId('content_footer_lite');
    expect(footerView).toBeDefined();
    const contentView = wrapper.queryByTestId(
      'post_view_content.lite_container',
    );
    expect(contentView).toBeDefined();
  });

  it('renders correctly data from prop postData', () => {
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView
        data={postData}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        postData={POST_DETAIL_2}
        isUseReduxState={false}
      />,
      store,
    );
    const view = wrapper.getByTestId('collapsible_text.level_1.content');
    expect(view.children?.[0]).toBe(POST_DETAIL_2.content);
  });

  it('press container should call prop onPress', () => {
    const callback = jest.fn();
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView
        testID="postViewTestID"
        data={postData}
        onPress={callback}
      />,
      store,
    );
    const btn = wrapper.getByTestId('postViewTestID');
    fireEvent.press(btn);
    expect(callback).toBeCalled();
  });

  it('press container should navigate to detail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const callback = jest.fn();
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView
        testID="postViewTestID"
        data={postData}
        onPress={callback}
        pressNavigateToDetail
      />,
      store,
    );
    const btn = wrapper.getByTestId('postViewTestID');
    fireEvent.press(btn);
    expect(navigate).toBeCalledWith(homeStack.postDetail, {
      post_id: POST_DETAIL.id,
    });
  });

  it('press comment should call prop onPressComment', () => {
    const callback = jest.fn();
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView
        data={postData}
        btnCommentTestID="btnCommentTestID"
        onPressComment={callback}
      />,
      store,
    );
    const btn = wrapper.getByTestId('btnCommentTestID');
    fireEvent.press(btn);
    expect(callback).toBeCalled();
  });

  it('press comment should navigate to post detail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView
        data={postData}
        btnCommentTestID="btnCommentTestID"
      />,
      store,
    );
    const btn = wrapper.getByTestId('btnCommentTestID');
    fireEvent.press(btn);
    expect(navigate).toBeCalled();
  });

  it('press header should call prop onPressHeader', () => {
    const callback = jest.fn();
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView data={postData} onPressHeader={callback} />,
      store,
    );
    const btn = wrapper.getByTestId('post_view_header');
    fireEvent.press(btn);
    expect(callback).toBeCalled();
  });

  it('press header should call navigate to post detail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView data={postData} />,
      store,
    );
    const btn = wrapper.getByTestId('post_view_header');
    fireEvent.press(btn);
    expect(navigate).toBeCalled();
  });

  it('press audience should dispatch show audiences', () => {
    const showModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showModal } as any;
      return state;
    });
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView data={postData} />,
      store,
    );
    const btn = wrapper.getByTestId('post_view_header.audiences');
    fireEvent.press(btn);
    expect(showModal).toBeCalled();
  });

  it('press menu should dispatch show modal menu', () => {
    const showModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showModal } as any;
      return state;
    });
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PostView data={postData} />,
      store,
    );
    const btn = wrapper.getByTestId('post_view_header.menu');
    fireEvent.press(btn);
    expect(showModal).toBeCalled();
  });
});
