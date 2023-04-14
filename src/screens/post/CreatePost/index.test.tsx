import React from 'react';

import i18next from 'i18next';
import {
  act, fireEvent, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import CreatePost from './index';
import streamApi from '~/api/StreamApi';
import { mockDraftPost } from '~/test/mock_data/draftPosts';
import useCreatePostStore from './store';
import MockedNavigator from '~/test/MockedNavigator';
import { mockEditPost } from '~/test/mock_data/post';
import * as Handler from './handler';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useCreatePost from './hooks/useCreatePost';
import useModalStore from '~/store/modal';

describe('CreatePost screen', () => {
  it('given no postId should create new post', async () => {
    const post = {
      data: mockDraftPost,
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    jest
      .spyOn(streamApi, 'postCreateNewPost')
      .mockImplementation(() => Promise.resolve(post) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    renderWithRedux(<MockedNavigator component={() => <CreatePost />} />);

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.id).toBe(
        mockDraftPost.id,
      );
    });
  });

  it('given draft post should publish post', async () => {
    const post = {
      data: mockDraftPost,
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    const spyApiPutEditPost = jest
      .spyOn(streamApi, 'putEditPost')
      .mockImplementation(() => Promise.resolve(post) as any);
    const spyApiPostPublishDraftPost = jest
      .spyOn(streamApi, 'postPublishDraftPost')
      .mockImplementation(() => Promise.resolve(post) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreatePost route={{ params: { draftPostId: mockDraftPost.id } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.isInitDone).toBeTruthy();
    });

    const btnPublish = wrapper.getByTestId('create_post.btn_post');

    act(() => {
      fireEvent.press(btnPublish);
    });

    await waitFor(() => {
      expect(spyApiPutEditPost).toBeCalled();
      expect(spyApiPostPublishDraftPost).toBeCalled();
    });
  });

  it('given a post should editable post', async () => {
    const post = {
      data: mockEditPost,
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    const spyApiPutEditPost = jest
      .spyOn(streamApi, 'putEditPost')
      .mockImplementation(() => Promise.resolve(post) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreatePost route={{ params: { postId: mockEditPost.id } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.isInitDone).toBeTruthy();
    });

    act(() => {
      resultCreatePostStore.current.actions.updateCreatePost({
        content: 'abc',
      });
    });

    const btnSave = wrapper.getByTestId('create_post.btn_post');

    act(() => {
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      expect(spyApiPutEditPost).toBeCalled();
    });
  });

  it('should call handler when back', async () => {
    const post = {
      data: mockEditPost,
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    const spyHandleBack = jest
      .spyOn(Handler, 'handleBack');
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreatePost route={{ params: { postId: mockEditPost.id } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.isInitDone).toBeTruthy();
    });

    const btnBack = wrapper.getByTestId('header.back.button');

    act(() => {
      fireEvent.press(btnBack);
    });

    await waitFor(() => {
      expect(spyHandleBack).toBeCalled();
    });
  });

  it('given audience with no permission settings should show alert', async () => {
    const post = {
      data: {
        ...mockEditPost,
        audience: {
          groups: [
            mockEditPost.audience.groups[0],
            {
              id: '123',
              name: 'abc',
            },
          ],
        },
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          '35b5fb8f-6f7a-4ac2-90bb-18199096c429': [PermissionKey.EDIT_OWN_CONTENT_SETTING],
        },
      },
    }));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <CreatePost route={{ params: { postId: mockEditPost.id } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.isInitDone).toBeTruthy();
    });

    const { result: resultCreatePost } = renderHook(() => useCreatePost());

    await waitFor(() => {
      expect(resultCreatePost.current.disableButtonsCreatePostFooter.settingDisabled).toBeFalsy();
    });

    const btnSettings = wrapper.getByTestId('header.menuIcon.button');

    act(() => {
      fireEvent.press(btnSettings);
    });

    await waitFor(() => {
      expect(useModalStore.getState().alert?.title).toBe(i18next.t('post:post_setting_permissions_alert:title'));
    });
  });
});
