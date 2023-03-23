/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';
import lodash from 'lodash';
import * as reactNativePermission from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import EditComment from './index';
import MockedNavigator from '~/test/MockedNavigator';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import { mockComment } from '~/test/mock_data/comment';
import useEditCommentController from './store';
import useModalStore from '~/store/modal';

describe('EditComment screen', () => {
  let Keyboard: any;
  let Platform: any;

  const groupIds = '1c396bbc-0b5f-4f4b-8822-4df69d012815,22a637b3-61d4-45f5-af33-df25bd88f76f';
  const commentId = mockComment.id;
  const postId = 'fc99d017-ed67-49bc-8a01-c98d8c80900a';
  const mockImage = {
    id: '055eb281-7b19-45ec-9cbb-021f6db466c9',
    name: 'd11577c7-8f7d-4d69-88d9-1133fcfc6460.jpg',
    status: 'completed',
    url: 'https://bic-dev-user-upload-images-s3-bucket.s3.ap-southeast-1.amazonaws.com/comment/original/d11577c7-8f7d-4d69-88d9-1133fcfc6460.jpg',
    size: 8379891,
    origin_name: 'C583ED0B-DCD4-4FC4-8237-3E89903EC2BA.jpg',
    width: 4032,
    height: 3024,
    extension: 'jpeg',
    mimeType: 'image/jpeg',
    type: 'image',
  };

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
    Platform = require('react-native').Platform;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should render correctly', () => {
    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockComment;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const textComp = wrapper.getByTestId('_mention_input.input');
    expect(textComp).toBeDefined();
    expect(textComp.props?.value).toEqual(mockComment.content);
  });

  it('should render correctly with giphy:', () => {
    const mockCommentHasGiphy = {
      ...mockComment,
      giphyId: 'sJWNLTclcvVmw',
      giphyUrl: 'https://i.giphy.com/sJWNLTclcvVmw.gif',
    };
    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockCommentHasGiphy;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const textComp = wrapper.getByTestId('_mention_input.input');
    expect(textComp).toBeDefined();

    const giphyComp = wrapper.getByTestId('edit_comment_screen.giphy');
    expect(giphyComp).toBeDefined();
  });

  it('should render correctly with image:', () => {
    const mockCommentHasImage = {
      ...mockComment,
      media: {
        images: [mockImage],
      },
    };
    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockCommentHasImage;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const textComp = wrapper.getByTestId('_mention_input.input');
    expect(textComp).toBeDefined();

    const imageComp = wrapper.getByTestId('upload_image');
    expect(imageComp).toBeDefined();
  });

  it('should call action edit comment successfully', () => {
    const spy = jest.spyOn(lodash, 'debounce');
    Keyboard.dismiss = jest.fn();

    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockComment;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const editComment = jest.fn();
    useEditCommentController.setState((state) => {
      state.actions.editComment = editComment;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const textComp = wrapper.getByTestId('_mention_input.input');
    expect(textComp).toBeDefined();
    expect(textComp.props?.value).toEqual(mockComment.content);

    jest.useFakeTimers();

    const buttonSave = wrapper.getByTestId('header.button');
    expect(buttonSave.props.accessibilityState.disabled).toBeTruthy();

    fireEvent.changeText(textComp, 'edited');
    jest.runAllTimers();
    expect(buttonSave.props.accessibilityState.disabled).toBeFalsy();

    jest.useFakeTimers();
    fireEvent.press(buttonSave);

    expect(spy).toBeCalled();
    jest.runAllTimers();
    expect(Keyboard.dismiss).toBeCalled();
    expect(editComment).toBeCalled();
  });

  it('should check permission when click image in CommentToolbar', () => {
    const spyCheckPermission = jest.spyOn(reactNativePermission, 'check');
    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockComment;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const btn = wrapper.getByTestId('comment_toolbar.btn_image');
    expect(btn).toBeDefined();
    fireEvent.press(btn);

    expect(spyCheckPermission).toBeCalled();
  });

  it('should call action edit comment if edit comment has image successfully:', () => {
    const spy = jest.spyOn(lodash, 'debounce');
    Keyboard.dismiss = jest.fn();

    const mockCommentHasImage = {
      ...mockComment,
      media: {
        images: [mockImage],
      },
    };
    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockCommentHasImage;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const editComment = jest.fn();
    useEditCommentController.setState((state) => {
      state.actions.editComment = editComment;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const textComp = wrapper.getByTestId('_mention_input.input');
    expect(textComp).toBeDefined();
    expect(textComp.props?.value).toEqual(mockComment.content);

    const imageComp = wrapper.getByTestId('upload_image');
    expect(imageComp).toBeDefined();

    const removeImageComp = wrapper.getByTestId('upload_image.button_close');
    expect(removeImageComp).toBeDefined();

    jest.useFakeTimers();

    const buttonSave = wrapper.getByTestId('header.button');
    expect(buttonSave.props.accessibilityState.disabled).toBeTruthy();

    fireEvent.press(removeImageComp);
    jest.runAllTimers();
    expect(buttonSave.props.accessibilityState.disabled).toBeFalsy();

    jest.useFakeTimers();
    fireEvent.press(buttonSave);

    expect(spy).toBeCalled();
    jest.runAllTimers();
    expect(Keyboard.dismiss).toBeCalled();
    expect(editComment).toBeCalled();
  });

  it('should call action edit comment if edit comment has gif:', () => {
    const spy = jest.spyOn(lodash, 'debounce');
    Keyboard.dismiss = jest.fn();

    const mockCommentHasGiphy = {
      ...mockComment,
      giphyId: 'sJWNLTclcvVmw',
      giphyUrl: 'https://i.giphy.com/sJWNLTclcvVmw.gif',
    };
    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockCommentHasGiphy;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const editComment = jest.fn();
    useEditCommentController.setState((state) => {
      state.actions.editComment = editComment;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const textComp = wrapper.getByTestId('_mention_input.input');
    expect(textComp).toBeDefined();
    expect(textComp.props?.value).toEqual(mockComment.content);

    const giphyComp = wrapper.getByTestId('edit_comment_screen.giphy');
    expect(giphyComp).toBeDefined();

    const removeGiphyComp = wrapper.getByTestId('edit_comment_screen.giphy.close_button');
    expect(removeGiphyComp).toBeDefined();

    jest.useFakeTimers();

    const buttonSave = wrapper.getByTestId('header.button');
    expect(buttonSave.props.accessibilityState.disabled).toBeTruthy();

    fireEvent.press(removeGiphyComp);
    jest.runAllTimers();
    expect(buttonSave.props.accessibilityState.disabled).toBeFalsy();

    jest.useFakeTimers();
    fireEvent.press(buttonSave);

    expect(spy).toBeCalled();
    jest.runAllTimers();
    expect(Keyboard.dismiss).toBeCalled();
    expect(editComment).toBeCalled();
  });

  it('should back to previous screen successfully ', () => {
    Keyboard.dismiss = jest.fn();

    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockComment;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(Keyboard.dismiss).toBeCalled();
  });

  it('should show alert when press back and content is changed:', () => {
    Keyboard.dismiss = jest.fn();

    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockComment;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const showAlert = jest.fn();
    useModalStore.setState((state) => {
      state.actions.showAlert = showAlert;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const textComp = wrapper.getByTestId('_mention_input.input');
    expect(textComp).toBeDefined();
    expect(textComp.props?.value).toEqual(mockComment.content);

    const buttonSave = wrapper.getByTestId('header.button');
    expect(buttonSave.props.accessibilityState.disabled).toBeTruthy();

    fireEvent.changeText(textComp, 'edited');
    expect(buttonSave.props.accessibilityState.disabled).toBeFalsy();

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);

    expect(Keyboard.dismiss).toBeCalled();
    expect(showAlert).toBeCalled();
  });

  it('should render correctly in mode android', () => {
    Platform.OS = 'android';
    jest.spyOn(DeviceInfo, 'getSystemVersion').mockImplementation(() => '8');

    useCommentsStore.setState((state) => {
      state.comments[commentId] = mockComment;
      return state;
    });

    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditComment
            route={{ params: { commentId, groupIds } }}
          />
        )}
      />,
    );

    const inputView = wrapper.getByTestId('edit_comment_screen.input_view');
    expect(inputView).toBeDefined();
    fireEvent.press(inputView);

    const textComp = wrapper.getByTestId('_mention_input.input');
    expect(textComp).toBeDefined();
    expect(textComp.props?.value).toEqual(mockComment.content);

    const btnGif = wrapper.getByTestId('comment_toolbar.btn_gif');
    expect(btnGif).toBeDefined();
    fireEvent.press(btnGif);

    const giphyView = wrapper.queryByTestId('sticker_view.grid_view');
    expect(giphyView).toBeDefined();

    const btnEmoji = wrapper.getByTestId('comment_toolbar.btn_icon');
    expect(btnEmoji).toBeDefined();
    fireEvent.press(btnEmoji);

    const emojiName = 'bic_check_mark';
    const emojiView = wrapper.queryAllByTestId('sticker_view.emoij');
    expect(emojiView).toBeDefined();

    const emojiComponent = wrapper.queryAllByTestId(`emoji_picker_row.emoji.${emojiName}`);
    expect(emojiComponent).not.toBeNull();
  });
});
