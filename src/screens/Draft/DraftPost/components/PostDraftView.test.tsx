import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import PostDraftView from './PostDraftView';
import { mockDraftPost } from '~/test/mock_data/draftPosts';
import { IPost, PostStatus } from '~/interfaces/IPost';
import * as navigationHook from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import useModalStore from '~/store/modal';

const mockData = mockDraftPost as IPost;

describe('PostDraftView component', () => {
  it('should show button delete, button edit and button Publish', () => {
    const wrapper = renderWithRedux(<PostDraftView data={mockData} />);
    const buttonDelete = wrapper.getByTestId('post_draft_view.button_delete');
    expect(buttonDelete).toBeDefined();
    const buttonEdit = wrapper.getByTestId('post_draft_view.button_edit');
    expect(buttonEdit).toBeDefined();
    const buttonPublish = wrapper.getByTestId('post_draft_view.button_publish');
    expect(buttonPublish).toBeDefined();
  });

  it('should hide modal and show alert when click button delete', () => {
    const hideModal = jest.fn();
    const showAlert = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { hideModal, showAlert } as any;
      return state;
    });

    const wrapper = renderWithRedux(<PostDraftView data={mockData} />);
    const buttonDelete = wrapper.getByTestId('post_draft_view.button_delete');
    expect(buttonDelete).toBeDefined();

    fireEvent.press(buttonDelete);
    expect(hideModal).toBeCalled();
    expect(showAlert).toBeCalled();
  });

  it('should navigate to edit post screen when click button edit', () => {
    const navigate = jest.fn();
    const rootNavigation = { canGoBack: false, navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<PostDraftView data={mockData} />);
    const buttonEdit = wrapper.getByTestId('post_draft_view.button_edit');
    expect(buttonEdit).toBeDefined();

    fireEvent.press(buttonEdit);
    expect(navigate).toBeCalledWith(homeStack.createPost, {
      draftPostId: mockData.id,
      replaceWithDetail: true,
    });
  });

  it('should disable button publish with id undefined', () => {
    const wrapper = renderWithRedux(<PostDraftView data={{} as IPost} />);
    const buttonPublish = wrapper.getByTestId('post_draft_view.button_publish');
    expect(buttonPublish).toBeDefined();
    expect(buttonPublish.props?.accessibilityState?.disabled).toBeTruthy();
  });

  it('should show text post is processing waiting for publish when post`s status = PROCESSING', () => {
    const wrapper = renderWithRedux(<PostDraftView
      data={{ ...mockData, status: PostStatus.PROCESSING } as IPost}
    />);
    const text = wrapper.getByTestId('post_draft_view.post_processing_publish');
    expect(text).toBeDefined();

    const buttonPublish = wrapper.queryByTestId('post_draft_view.button_publish');
    expect(buttonPublish).toBeNull();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
