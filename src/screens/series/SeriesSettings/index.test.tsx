import React from 'react';
import {
  act, fireEvent, render, waitFor,
} from '~/test/testUtils';
import SeriesSettings from './index';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { seriesDetail } from '~/test/mock_data/series';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import * as SettingImportantHelper from '~/helpers/settingImportant';
import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';

describe('SeriesSettings screen', () => {
  it('should show audience without permission modal', async () => {
    const series = {
      ...seriesDetail.data,
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
    usePostsStore.getState().actions.addToPosts({ data: series as any });

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <SeriesSettings
            route={{
              params: { seriesId: series.id, isFromSeriesMenuSettings: true },
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
      expect(wrapper.getByTestId('series_settings.list_audience')).toBeDefined();
    });
  });

  it('should show expire time modal', async () => {
    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          'f84e82b5-18c6-4291-8f3a-9bf4da714e99': [
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
          ],
        },
      },
    }));
    usePostsStore.getState().actions.addToPosts({ data: seriesDetail.data as any });

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <SeriesSettings
            route={{
              params: { seriesId: seriesDetail.data.id, isFromSeriesMenuSettings: true },
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
      expect(wrapper.getByTestId('series_settings.list_suggest_expire_time')).toBeDefined();
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
          'f84e82b5-18c6-4291-8f3a-9bf4da714e99': [
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
          ],
        },
      },
    }));
    usePostsStore.getState().actions.addToPosts({ data: seriesDetail.data as any });

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <SeriesSettings
            route={{
              params: { seriesId: seriesDetail.data.id, isFromSeriesMenuSettings: true },
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
      expect(wrapper.getByTestId('series_settings.list_suggest_expire_time')).toBeDefined();
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
    usePostsStore.getState().actions.addToPosts({ data: seriesDetail.data as any });
    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          'f84e82b5-18c6-4291-8f3a-9bf4da714e99': [
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
          ],
        },
      },
    }));
    jest.spyOn(streamApi, 'getSeriesDetail').mockReturnValueOnce({
      data: {
        ...seriesDetail.data,
        setting: {
          ...seriesDetail.data.setting,
          isImportant: true,
        },
      },
    } as any);
    jest.spyOn(streamApi, 'putEditSettings').mockReturnValue({} as any);

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <SeriesSettings
            route={{
              params: { seriesId: seriesDetail.data.id, isFromSeriesMenuSettings: true },
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

    await waitFor(() => {
      expect(wrapper.getByTestId('mark_important.important_date_dropdown')).toBeDefined();
    });

    const btnSave = wrapper.getByTestId('header.button');
    fireEvent.press(btnSave);

    await waitFor(() => {
      expect(usePostsStore.getState().posts[seriesDetail.data.id].setting.isImportant).toBeTruthy();
    });
  });

  it('should show alert when user press back', async () => {
    usePostsStore.getState().actions.addToPosts({ data: seriesDetail.data as any });
    useMyPermissionsStore.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        groups: {
          'f84e82b5-18c6-4291-8f3a-9bf4da714e99': [
            PermissionKey.EDIT_OWN_CONTENT_SETTING,
          ],
        },
      },
    }));

    const wrapper = render(
      <MockedNavigator
        component={() => (
          <SeriesSettings
            route={{
              params: { seriesId: seriesDetail.data.id, isFromSeriesMenuSettings: true },
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

    await waitFor(() => {
      expect(wrapper.getByTestId('mark_important.important_date_dropdown')).toBeDefined();
    });

    const btnBack = wrapper.getByTestId('header.back');

    fireEvent.press(btnBack);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBeTruthy();
    });
  });
});
