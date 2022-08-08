import React from 'react';

import { createTestStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import initialState from '~/store/initialState';
import PostDetailContent from '~/screens/Post/PostDetail/PostDetailContent';
import { POST_DETAIL } from '~/test/mock_data/post';
import MockedNavigator from '~/test/MockedNavigator';
import { USER_PROFILE } from '~/test/mock_data/menu';
import postActions from '~/screens/Post/redux/actions';
import * as navigationHook from '~/hooks/navigation';
import modalActions from '~/store/modal/actions';

describe('PostDetailContent component', () => {
  const props = { route: { params: { post_id: POST_DETAIL.id } } };
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = {
      ...initialState,
      ...{
        post: { allPosts: { [POST_DETAIL.id]: POST_DETAIL } },
        noInternet: { isInternetReachable: true },
        auth: {
          user: {
            signInUserSession: {
              idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
            },
          },
        },
      },
    } as any;
  });

  // it(`renders correctly`, async () => {
  //   const store = createTestStore(storeData);
  //   const wrapper = renderWithRedux(
  //     <MockedNavigator component={() => <PostDetailContent {...props} />} />,
  //     store,
  //   );
  //   const rendered = wrapper.toJSON();
  //   expect(rendered).toMatchSnapshot();
  // });

  it('should render postViewPlaceholder when not have data of post in allPosts', () => {
    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <PostDetailContent {...props} />} />,
      store,
    );
    const postViewPlaceholder = wrapper.queryAllByTestId(
      'post_view_placeholder',
    );
    expect(postViewPlaceholder?.length);
  });

  it('renders content correctly', () => {
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <PostDetailContent {...props} />} />,
      store,
    );
    const postView = wrapper.queryByTestId('post_view');
    expect(postView).not.toBeNull();
  });

  // it('should not renders', () => {
  //   const store = createTestStore(storeData);
  //   const wrapper = renderWithRedux(
  //     <MockedNavigator component={() => <PostDetailContent />} />,
  //     store,
  //   );
  //   const postView = wrapper.queryByTestId('post_view');
  //   expect(postView).toBeNull();
  // });

  it('getPostDetail should be called', () => {
    const spy = jest.spyOn(postActions, 'getPostDetail');
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <PostDetailContent {...props} />} />,
      store,
    );
    expect(spy).toBeCalled();
  });

  it('should scroll to latest item', () => {
    const _storeData = {
      ...storeData,
      post: { ...storeData.post, scrollToLatestItem: true },
    };
    const spy = jest.spyOn(postActions, 'setScrollToLatestItem');
    const store = createTestStore(_storeData);
    renderWithRedux(
      <MockedNavigator component={() => <PostDetailContent {...props} />} />,
      store,
    );
    expect(spy).toBeCalled();
  });

  it('should call navigate to comment detail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <PostDetailContent {...props} />} />,
      store,
    );
    const btnReply = wrapper.getAllByTestId('comment_view.reply')?.[0];
    fireEvent.press(btnReply);
    expect(navigate).toBeCalled();
  });

  it('should call go back without input comment content', () => {
    const goBack = jest.fn();
    const rootNavigation = { canGoBack: true, goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <PostDetailContent {...props} />} />,
      store,
    );
    const btnBack = wrapper.getByTestId('header.back.button');
    fireEvent.press(btnBack);
    expect(goBack).toBeCalled();
  });

  it('should show alert when back after input comment content', () => {
    const spy = jest.spyOn(modalActions, 'showAlert');
    const goBack = jest.fn();
    const rootNavigation = { canGoBack: true, goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <PostDetailContent {...props} />} />,
      store,
    );
    const commentInput = wrapper.getByTestId('comment_input');
    fireEvent.changeText(commentInput, 'comment');
    const btnBack = wrapper.getByTestId('header.back.button');
    fireEvent.press(btnBack);
    expect(spy).toBeCalled();
  });

  it('should navigate to newsfeed if cant go back', () => {
    const navigate = jest.fn();
    const rootNavigation = { canGoBack: false, navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <PostDetailContent {...props} />} />,
      store,
    );
    const btnBack = wrapper.getByTestId('header.back.button');
    fireEvent.press(btnBack);
    expect(navigate).toBeCalled();
  });

  it('should go back when open deleted post', () => {
    const goBack = jest.fn();
    const rootNavigation = { canGoBack: true, goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const _storeData = {
      ...initialState,
      ...{
        post: { allPosts: { [POST_DETAIL.id]: { ...POST_DETAIL, deleted: true } } },
        noInternet: { isInternetReachable: true },
        auth: {
          user: {
            signInUserSession: {
              idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
            },
          },
        },
      },
    } as any;
    const store = createTestStore(_storeData);
    renderWithRedux(
      <MockedNavigator component={() => <PostDetailContent {...props} />} />,
      store,
    );
    expect(goBack).toBeCalled();
  });
});
