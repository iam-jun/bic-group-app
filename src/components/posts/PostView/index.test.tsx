import React from 'react';

import {
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import PostView from '~/components/posts/PostView';
import { POST_DETAIL } from '~/test/mock_data/post';
import * as navigationHook from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { IPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import useModalStore from '~/store/modal';

describe('PostView Component', () => {
  usePostsStore.setState((state) => {
    state.posts = { [POST_DETAIL.id]: POST_DETAIL } as any;
    return state;
  });
  const postData = POST_DETAIL as unknown as IPost;

  it('renders important', async () => {
    const newPostData = {
      ...POST_DETAIL,
      setting: {
        isImportant: true,
        importantExpiredAt: '2030-04-20T11:07:08.129Z',
      },

    } as any;
    const wrapper = renderWithRedux(
      <PostView data={newPostData} isLite />,
    );
    const importantStatusLite = wrapper.queryByTestId(
      'post_view.important_status_lite',
    );
    expect(importantStatusLite).not.toBeNull();
  });

  it('renders correctly post view lite', async () => {
    const wrapper = renderWithRedux(
      <PostView isLite data={postData} />,
    );
    const footerView = wrapper.queryByTestId('content_footer_lite');
    expect(footerView).toBeDefined();
    const contentView = wrapper.queryByTestId(
      'post_view_content.lite_container',
    );
    expect(contentView).toBeDefined();
  });

  it('renders correctly data from prop postData', () => {
    const wrapper = renderWithRedux(
      <PostView
        data={postData}
      />,
    );
    const view = wrapper.getByTestId('collapsible_text.level_1.content');
    expect(view.children?.[0]).toEqual('Hello world ');
  });

  it('press container should call prop onPress', () => {
    const callback = jest.fn();
    const wrapper = renderWithRedux(
      <PostView
        testID="postViewTestID"
        data={postData}
        onPress={callback}
      />,
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
    const wrapper = renderWithRedux(
      <PostView
        testID="postViewTestID"
        data={postData}
        onPress={callback}
        pressNavigateToDetail
      />,
    );
    const btn = wrapper.getByTestId('postViewTestID');
    fireEvent.press(btn);
    expect(navigate).toBeCalledWith(homeStack.postDetail, {
      post_id: POST_DETAIL.id,
    });
  });

  it('press comment should call prop onPressComment', () => {
    usePostsStore.setState((state) => {
      state.posts = {
        [POST_DETAIL.id]: {
          ...POST_DETAIL,
          setting: {
            canReact: true,
            canComment: true,
          },
        },
      } as any;
      return state;
    });
    const callback = jest.fn();
    const wrapper = renderWithRedux(
      <PostView
        data={postData}
        hasReactPermission
        btnCommentTestID="btnCommentTestID"
        onPressComment={callback}
      />,
    );
    const btn = wrapper.getByTestId('btnCommentTestID');
    fireEvent.press(btn);
    expect(callback).toBeCalled();
  });

  it('press comment should navigate to post detail', () => {
    usePostsStore.setState((state) => {
      state.posts = {
        [POST_DETAIL.id]: {
          ...POST_DETAIL,
          setting: {
            canReact: true,
            canComment: true,
          },
        },
      } as any;
      return state;
    });
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const wrapper = renderWithRedux(
      <PostView
        data={postData}
        hasReactPermission
        btnCommentTestID="btnCommentTestID"
      />,
    );
    const btn = wrapper.getByTestId('btnCommentTestID');
    fireEvent.press(btn);
    expect(navigate).toBeCalled();
  });

  it('press header should call prop onPressHeader', () => {
    const callback = jest.fn();
    const wrapper = renderWithRedux(
      <PostView data={postData} onPressHeader={callback} />,
    );
    const btn = wrapper.getByTestId('content_header');
    fireEvent.press(btn);
    expect(callback).toBeCalled();
  });

  it('press header should call navigate to post detail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const wrapper = renderWithRedux(
      <PostView data={postData} />,
    );
    const btn = wrapper.getByTestId('content_header');
    fireEvent.press(btn);
    expect(navigate).toBeCalled();
  });

  it('press audience should dispatch show audiences', () => {
    const showModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showModal } as any;
      return state;
    });
    const wrapper = renderWithRedux(
      <PostView data={postData} />,
    );
    const btn = wrapper.getByTestId('content_header.audiences');
    fireEvent.press(btn);
    expect(showModal).toBeCalled();
  });
});
