import React from 'react';

import {
  act, fireEvent, render, waitFor,
} from '~/test/testUtils';
import PostSettings from '~/screens/post/PostSettings/index';
import { POST_DETAIL } from '~/test/mock_data/post';
import MockedNavigator from '~/test/MockedNavigator';
import streamApi from '~/api/StreamApi';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import * as SettingImportantHelper from '~/helpers/settingImportant';
import usePostsStore from '~/store/entities/posts';
import useModalStore from '~/store/modal';

describe('Post Setting Screen', () => {
  it('should toggle can comment', async () => {
    jest.spyOn(streamApi, 'getPostDetail').mockReturnValue({ data: POST_DETAIL } as any);

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <PostSettings
            route={{
              params: { postId: POST_DETAIL.id, isFromPostMenuSettings: true },
            }}
          />
        )}
      />,
    );

    let toggleBtn;
    await waitFor(() => {
      toggleBtn = wrapper.getByTestId('post_settings.toggle_can_comment');
    });

    fireEvent.press(toggleBtn);

    const toggleViews = wrapper.getAllByTestId('toggle.view');
    await waitFor(() => {
      const stylesToggleView = toggleViews[1].props.style;
      expect(stylesToggleView[1].backgroundColor).toBe('#D1D4DB');
    });
  });

  it('should toggle can react', async () => {
    jest.spyOn(streamApi, 'getPostDetail').mockReturnValue({ data: POST_DETAIL } as any);

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <PostSettings
            route={{
              params: { postId: POST_DETAIL.id, isFromPostMenuSettings: true },
            }}
          />
        )}
      />,
    );

    let toggleBtn;
    await waitFor(() => {
      toggleBtn = wrapper.getByTestId('post_settings.toggle_can_react');
    });

    fireEvent.press(toggleBtn);

    const toggleViews = wrapper.getAllByTestId('toggle.view');
    await waitFor(() => {
      const stylesToggleView = toggleViews[2].props.style;
      expect(stylesToggleView[1].backgroundColor).toBe('#D1D4DB');
    });
  });

  it('should show audience without permission modal', async () => {
    const mockPost = {
      ...POST_DETAIL,
      audience: {
        groups: [
          {
            id: '1',
            name: 'abc',
          },
          {
            id: '2',
            name: 'abc',
          },
          {
            id: '3',
            name: 'abc',
          },
          {
            id: '4',
            name: 'abc',
          },
        ],
      },
    };
    jest.spyOn(streamApi, 'getPostDetail').mockReturnValue({ data: mockPost } as any);
    // usePostsStore.getState().actions.addToPosts({ data: mockPost as any });

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <PostSettings
            route={{
              params: { postId: mockPost.id, isFromPostMenuSettings: true },
            }}
          />
        )}
      />,
    );

    let toggleBtn;
    await waitFor(() => {
      toggleBtn = wrapper.getByTestId('post_settings.toggle_important');
    });

    fireEvent.press(toggleBtn);

    let textMoreAudienceWithoutPermission;
    await waitFor(() => {
      textMoreAudienceWithoutPermission = wrapper.getByTestId('mark_important.text_more_audience_without_permission');
    });

    fireEvent.press(textMoreAudienceWithoutPermission);

    await waitFor(() => {
      expect(wrapper.getByTestId('post_settings.list_audience')).toBeDefined();
    });
  });

  it('should show expire time modal', async () => {
    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          1: [
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
          ],
        },
      },
    }));
    jest.spyOn(streamApi, 'getPostDetail').mockReturnValue({ data: POST_DETAIL } as any);
    // usePostsStore.getState().actions.addToPosts({ data: mockPost as any });

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <PostSettings
            route={{
              params: { postId: POST_DETAIL.id, isFromPostMenuSettings: true },
            }}
          />
        )}
      />,
    );

    let toggleBtn;
    await waitFor(() => {
      toggleBtn = wrapper.getByTestId('post_settings.toggle_important');
    });

    fireEvent.press(toggleBtn);

    let importantDateDropdown;
    await waitFor(() => {
      importantDateDropdown = wrapper.getByTestId('mark_important.important_date_dropdown');
    });

    fireEvent.press(importantDateDropdown);

    await waitFor(() => {
      expect(wrapper.getByTestId('post_settings.list_suggest_expire_time')).toBeDefined();
    });
  });

  it('should set date & time expire', async () => {
    const spyHandleChangeDatePickerImportant = jest.spyOn(SettingImportantHelper, 'handleChangeDatePickerImportant');
    const spyHandleChangeTimePickerImportant = jest.spyOn(SettingImportantHelper, 'handleChangeTimePickerImportant');
    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          1: [
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
          ],
        },
      },
    }));
    jest.spyOn(streamApi, 'getPostDetail').mockReturnValue({ data: POST_DETAIL } as any);
    // usePostsStore.getState().actions.addToPosts({ data: mockPost as any });

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <PostSettings
            route={{
              params: { postId: POST_DETAIL.id, isFromPostMenuSettings: true },
            }}
          />
        )}
      />,
    );

    let toggleBtn;
    await waitFor(() => {
      toggleBtn = wrapper.getByTestId('post_settings.toggle_important');
    });

    fireEvent.press(toggleBtn);

    let importantDateDropdown;
    await waitFor(() => {
      importantDateDropdown = wrapper.getByTestId('mark_important.important_date_dropdown');
    });

    fireEvent.press(importantDateDropdown);

    await waitFor(() => {
      expect(wrapper.getByTestId('post_settings.list_suggest_expire_time')).toBeDefined();
    });

    const itemCustomTime = wrapper.getAllByTestId('post_settings.item')[9];
    fireEvent.press(itemCustomTime);

    let btnOpenDatePicker;
    let btnOpenTimePicker;
    await waitFor(() => {
      btnOpenDatePicker = wrapper.getByTestId('post_settings.important.btn_date');
      btnOpenTimePicker = wrapper.getByTestId('post_settings.important.btn_time');
    });

    fireEvent.press(btnOpenDatePicker);

    let datetimePicker;
    await waitFor(() => {
      datetimePicker = wrapper.getByTestId('date_input.date_picker');
    });

    await act(() => {
      fireEvent(datetimePicker, 'onChange', {
        nativeEvent: { timestamp: '01/01/2024' },
      });
    });

    let confirmLabel;
    await waitFor(() => {
      confirmLabel = wrapper.getByLabelText(/confirm/i);
    });

    fireEvent.press(confirmLabel);

    await waitFor(() => {
      expect(spyHandleChangeDatePickerImportant).toBeCalled();
    });

    await waitFor(() => {
      expect(wrapper.queryAllByTestId('date_input.date_picker').length).toBe(0);
    });

    fireEvent.press(btnOpenTimePicker);

    await waitFor(() => {
      datetimePicker = wrapper.getByTestId('date_input.date_picker');
    });

    await act(() => {
      fireEvent(datetimePicker, 'onChange', {
        nativeEvent: { timestamp: '01/01/2024' },
      });
    });

    await waitFor(() => {
      confirmLabel = wrapper.getByLabelText(/confirm/i);
    });

    fireEvent.press(confirmLabel);

    await waitFor(() => {
      expect(spyHandleChangeTimePickerImportant).toBeCalled();
    });
  });

  it('should save success', async () => {
    jest.spyOn(streamApi, 'getPostDetail').mockReturnValueOnce({ data: POST_DETAIL } as any).mockReturnValueOnce({
      data: {
        ...POST_DETAIL,
        setting: {
          ...POST_DETAIL.setting,
          canReact: false,
        },
      },
    } as any);
    jest.spyOn(streamApi, 'getCommentsByPostId').mockReturnValue({ data: { list: [], meta: {} } } as any);
    jest.spyOn(streamApi, 'putEditSettings').mockReturnValue({} as any);

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <PostSettings
            route={{
              params: { postId: POST_DETAIL.id, isFromPostMenuSettings: true },
            }}
          />
        )}
      />,
    );

    let toggleBtn;
    await waitFor(() => {
      toggleBtn = wrapper.getByTestId('post_settings.toggle_can_react');
    });

    fireEvent.press(toggleBtn);

    const toggleViews = wrapper.getAllByTestId('toggle.view');
    await waitFor(() => {
      const stylesToggleView = toggleViews[2].props.style;
      expect(stylesToggleView[1].backgroundColor).toBe('#D1D4DB');
    });

    const btnSave = wrapper.getByTestId('post_settings.btn_save');
    fireEvent.press(btnSave);

    await waitFor(() => {
      expect(usePostsStore.getState().posts[POST_DETAIL.id].setting.canReact).toBeFalsy();
    });
  });

  it('should show alert when user press back', async () => {
    jest.spyOn(streamApi, 'getPostDetail').mockReturnValueOnce({ data: POST_DETAIL } as any);

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <PostSettings
            route={{
              params: { postId: POST_DETAIL.id, isFromPostMenuSettings: true },
            }}
          />
        )}
      />,
    );

    let toggleBtn;
    await waitFor(() => {
      toggleBtn = wrapper.getByTestId('post_settings.toggle_can_react');
    });

    fireEvent.press(toggleBtn);

    const toggleViews = wrapper.getAllByTestId('toggle.view');
    await waitFor(() => {
      const stylesToggleView = toggleViews[2].props.style;
      expect(stylesToggleView[1].backgroundColor).toBe('#D1D4DB');
    });

    const btnBack = wrapper.getByTestId('header.back');

    fireEvent.press(btnBack);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBeTruthy();
    });
  });
});
