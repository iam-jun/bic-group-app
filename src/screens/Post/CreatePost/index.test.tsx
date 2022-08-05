import React from 'react';
import DeviceInfo from 'react-native-device-info';

import {
  act,
  createTestStore,
  fireEvent,
  getHookReduxWrapper,
  languages,
  renderHook,
  renderWithRedux,
  waitForUpdateRedux,
} from '~/test/testUtils';
import initialState from '~/store/initialState';
import CreatePost from '.';
import { GROUP_AUDIENCE, POST_DETAIL } from '~/test/mock_data/post';
import * as navigationHook from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import modalActions from '~/store/modal/actions';
import useCreatePost, {
  handlePressPostResultType,
} from '~/screens/Post/CreatePost/hooks/useCreatePost';
import MockedNavigator from '~/test/MockedNavigator';

describe('Create Post screen', () => {
  let Platform: any;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  const navigate = jest.fn();
  const goBack = jest.fn();
  const rootNavigation = { navigate, goBack };
  jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

  it('renders correctly with 1 audience selected, empty content, button post disabled', async () => {
    const storeData = { ...initialState };
    storeData.post.createPost.chosenAudiences = [GROUP_AUDIENCE] as any;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={CreatePost} />,
      store,
    );
    const btnPost = wrapper.getByTestId('create_post.btn_post');
    expect(btnPost.props?.accessibilityState?.disabled).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should enable button post after change text content', async () => {
    const storeData = { ...initialState };
    storeData.post.createPost.chosenAudiences = [GROUP_AUDIENCE] as any;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={CreatePost} />,
      store,
    );
    const btnPost = wrapper.getByTestId('create_post.btn_post');
    expect(btnPost.props?.accessibilityState?.disabled).toBe(true);
    const input = wrapper.getByTestId('_mention_input.input');
    fireEvent.changeText(input, 'hello');
    await waitForUpdateRedux();
    expect(btnPost.props?.accessibilityState?.disabled).toBe(false);
  });

  it('should navigate to screen post settings when press button settings', async () => {
    const wrapper = renderWithRedux(<MockedNavigator component={CreatePost} />);
    const btnSettings = wrapper.getByTestId('create_post.btn_post_settings');
    fireEvent.press(btnSettings);
    expect(navigate).toBeCalledWith(homeStack.postSettings);
  });

  it('should navigate to screen select audience when press chosen audience view', async () => {
    const wrapper = renderWithRedux(<MockedNavigator component={CreatePost} />);
    const chosenAudienceView = wrapper.getByTestId(
      'create_post_chosen_audiences',
    );
    fireEvent.press(chosenAudienceView);
    expect(navigate).toBeCalledWith(homeStack.postSelectAudience);
  });

  it('should show when press back', () => {
    const wrapper = renderWithRedux(<MockedNavigator component={CreatePost} />);
    const btnBack = wrapper.getByTestId('header.back');
    fireEvent.press(btnBack);
  });

  it('should use clone text on Android 8', () => {
    Platform.OS = 'android';
    const spy = jest
      .spyOn(DeviceInfo, 'getSystemVersion')
      .mockImplementation(() => '8');
    const wrapper = renderWithRedux(<MockedNavigator component={CreatePost} />);
    const cloneTextContainer = wrapper.queryByTestId(
      'create_post.clone_text_container',
    );
    expect(cloneTextContainer).not.toBeNull();
    spy.mockClear();
  });

  // test hook for some case can't cover by interact to UI
  it('handlePressPost should done with newPost', async () => {
    const wrapper = getHookReduxWrapper();
    const { result } = renderHook(() => useCreatePost({ screenParams: {} }), {
      wrapper,
    });
    let pressResult: handlePressPostResultType;
    act(() => {
      pressResult = result.current.handlePressPost();
      expect(pressResult).toBe('newPost');
    });
  });

  it('handlePressPost should done with loading', async () => {
    const stateData = { ...initialState };
    stateData.post.createPost = { loading: true } as any;
    const store = createTestStore(stateData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(
      () => useCreatePost({ screenParams: { postId: POST_DETAIL.id } }),
      {
        wrapper,
      },
    );
    let pressResult: handlePressPostResultType;
    act(() => {
      pressResult = result.current.handlePressPost();
      expect(pressResult).toBe('loading');
    });
  });
});

describe('Edit Post screen', () => {
  const editPostStoreData = {
    ...initialState,
    ...{ post: { allPosts: { [POST_DETAIL.id]: POST_DETAIL } } },
  } as any;

  const editDraftStoreData = {
    ...initialState,
    ...{
      post: {
        allPosts: { [POST_DETAIL.id]: { ...POST_DETAIL, isDraft: true } },
        draftPosts: { posts: [{ ...POST_DETAIL, isDraft: true }] },
      },
    },
  } as any;

  it('should not show alert when press back edit post without change content', () => {
    const spy = jest.spyOn(modalActions, 'showAlert');
    const store = createTestStore(editPostStoreData);
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreatePost route={{ params: { postId: POST_DETAIL.id } }} />
        )}
      />,
      store,
    );
    const headerText = wrapper.getByTestId('header.text');
    expect(headerText.props.children).toBe(languages.post.title_edit_post);
    const btnBack = wrapper.getByTestId('header.back');
    fireEvent.press(btnBack);
    expect(spy).not.toBeCalled();
  });

  it('should show alert when press back edit post with content changed', () => {
    const spy = jest.spyOn(modalActions, 'showAlert');
    const store = createTestStore(editPostStoreData);
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreatePost route={{ params: { postId: POST_DETAIL.id } }} />
        )}
      />,
      store,
    );
    const headerText = wrapper.getByTestId('header.text');
    expect(headerText.props.children).toBe(languages.post.title_edit_post);
    const btnBack = wrapper.getByTestId('header.back');
    const input = wrapper.getByTestId('_mention_input.input');
    fireEvent.changeText(input, 'hello');
    fireEvent.press(btnBack);
    expect(spy).toBeCalled();
  });

  it('handlePressPost should done with editPost', async () => {
    const store = createTestStore(editPostStoreData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(
      () => useCreatePost({ screenParams: { postId: POST_DETAIL.id } }),
      {
        wrapper,
      },
    );
    let pressResult: handlePressPostResultType;
    act(() => {
      pressResult = result.current.handlePressPost();
      expect(pressResult).toBe('editPost');
    });
  });

  it('handlePressPost should done with editDraft', async () => {
    const store = createTestStore(editDraftStoreData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(
      () => useCreatePost({ screenParams: { draftPostId: POST_DETAIL.id } }),
      {
        wrapper,
      },
    );
    let pressResult: handlePressPostResultType;
    act(() => {
      pressResult = result.current.handlePressPost();
      expect(pressResult).toBe('editDraft');
    });
  });
});
