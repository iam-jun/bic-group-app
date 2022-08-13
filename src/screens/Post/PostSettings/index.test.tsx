import React from 'react';

import {
  act,
  createTestStore,
  fireEvent,
  getHookReduxWrapper,
  renderHook,
  renderWithRedux,
} from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import PostSettings from '~/screens/Post/PostSettings/index';
import colors from '~/theme/theme';
import * as navigationHook from '~/hooks/navigation';
import modalActions from '~/storeRedux/modal/actions';
import postActions from '../../../storeRedux/post/actions';
import { usePostSettings } from '~/screens/Post/PostSettings/usePostSettings';
import { POST_DETAIL } from '~/test/mock_data/post';

describe('Post Setting Screen', () => {
  let storeData: any;

  beforeEach(() => {
    storeData = { ...initialState };
    storeData.post.createPost.currentSettings = {
      active: false,
      expires_time: '',
    } as any;
    storeData.post.createPost.important = {
      active: false,
      expires_time: '',
    } as any;
  });

  it('renders correctly default setting', async () => {
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    const btnSave = wrapper.getByTestId('post_settings.btn_save');
    expect(btnSave?.props?.accessibilityState?.disabled).toBe(true);

    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important.out_side_view',
    );
    expect(toggleImportant?.props?.style?.backgroundColor).toEqual(
      colors.light.colors.gray10,
    );
  });

  it('renders correctly disable to enable important', async () => {
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    const btnSave = wrapper.getByTestId('post_settings.btn_save');
    expect(btnSave?.props?.accessibilityState?.disabled).toBe(true);

    const toggleImportantView = wrapper.getByTestId(
      'post_settings.toggle_important.out_side_view',
    );
    expect(toggleImportantView?.props?.style?.backgroundColor).toEqual(
      colors.light.colors.gray10,
    );

    // active important
    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important',
    );
    fireEvent.press(toggleImportant);

    expect(btnSave?.props?.accessibilityState?.disabled).toBe(false);
    expect(toggleImportantView?.props?.style?.backgroundColor).toEqual(
      colors.light.colors.success,
    );
  });

  it('renders correctly enable to disable important', async () => {
    const storeData = { ...initialState };
    storeData.post.createPost.currentSettings = {
      active: true,
      expires_time: '2059368665000',
    } as any;
    storeData.post.createPost.important = {
      active: true,
      expires_time: '2059368665000',
    } as any;

    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    const btnSave = wrapper.getByTestId('post_settings.btn_save');
    expect(btnSave?.props?.accessibilityState?.disabled).toBe(true);

    const toggleImportantView = wrapper.getByTestId(
      'post_settings.toggle_important.out_side_view',
    );
    expect(toggleImportantView?.props?.style?.backgroundColor).toEqual(
      colors.light.colors.success,
    );

    // inactive important
    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important',
    );
    fireEvent.press(toggleImportant);

    expect(btnSave?.props?.accessibilityState?.disabled).toBe(false);
    expect(toggleImportantView?.props?.style?.backgroundColor).toEqual(
      colors.light.colors.gray10,
    );
  });

  it('should show navigate back when press back without changed', () => {
    const navigate = jest.fn();
    const goBack = jest.fn();
    const rootNavigation = { navigate, goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    const btnBack = wrapper.getByTestId('header.back.button');
    fireEvent.press(btnBack);
    expect(goBack).toBeCalled();
  });

  it('should show alert when press back with changed', () => {
    const spy = jest.spyOn(modalActions, 'showAlert');

    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    // active important
    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important',
    );
    fireEvent.press(toggleImportant);

    const btnBack = wrapper.getByTestId('header.back.button');
    fireEvent.press(btnBack);

    expect(spy).toBeCalled();
  });

  it('should dispatch setCreatePostSettings then go back when press back with changed', async () => {
    const spy = jest.spyOn(postActions, 'setCreatePostSettings');

    const goBack = jest.fn();
    const rootNavigation = { goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    // active important
    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important',
    );
    fireEvent.press(toggleImportant);

    const btnSave = wrapper.getByTestId('post_settings.btn_save');
    fireEvent.press(btnSave);

    // only 1 setting important active, update if has more setting in the future
    expect(spy).toBeCalledWith(expect.objectContaining({ count: 1 }));
    expect(goBack).toBeCalled();
  });

  it('should render important date picker when press important date', () => {
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    // active important
    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important',
    );
    fireEvent.press(toggleImportant);

    const btnImportantDate = wrapper.getByTestId(
      'post_settings.important.btn_date',
    );
    fireEvent.press(btnImportantDate);

    // expect(wrapper).toMatchSnapshot();
    const importantDatePicker = wrapper.queryByTestId(
      'post_settings.important.date_picker',
    );
    expect(importantDatePicker).not.toBeNull();
  });

  it('should render important time picker when press important time', () => {
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    // active important
    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important',
    );
    fireEvent.press(toggleImportant);

    const btnImportantTime = wrapper.getByTestId(
      'post_settings.important.btn_time',
    );
    fireEvent.press(btnImportantTime);

    // expect(wrapper).toMatchSnapshot();
    const importantDatePicker = wrapper.queryByTestId(
      'post_settings.important.time_picker',
    );
    expect(importantDatePicker).not.toBeNull();
  });

  it('should update state important date as selected when change date', () => {
    const currentDate2 = new Date();
    const next2Days = currentDate2.setDate(currentDate2.getDate() + 2);
    const initExpiresTime = new Date(next2Days).getTime();
    storeData.post.createPost.currentSettings = {
      active: true,
      expires_time: initExpiresTime,
    } as any;
    storeData.post.createPost.important = {
      active: true,
      expires_time: initExpiresTime,
    } as any;

    const currentDate = new Date();
    const tomorrow = new Date(
      currentDate.setDate(currentDate.getDate() + 1),
    ).setSeconds(0, 0);

    const store = createTestStore(storeData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(() => usePostSettings(), { wrapper });
    act(() => {
      result.current.handleChangeDatePicker(new Date(tomorrow));
    });
    const date = new Date(result.current.sImportant?.expires_time || '');
    expect(date.toISOString()).toEqual(new Date(tomorrow).toISOString());
  });

  it('should update state important date as min date when change date to yesterday', () => {
    const currentDate = new Date();
    const yesterday = currentDate.setDate(currentDate.getDate() - 1);

    const store = createTestStore(storeData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(() => usePostSettings(), { wrapper });
    act(() => {
      result.current.handleChangeDatePicker(new Date(yesterday));
    });
    const date = new Date(result.current.sImportant?.expires_time || '');
    expect(date.toISOString()).not.toEqual(new Date(yesterday).toISOString());
  });

  it('should update state important hour as selected when change hour', () => {
    const currentDate = new Date();
    const tomorrow = currentDate.setDate(currentDate.getDate() + 1);

    const store = createTestStore(storeData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(() => usePostSettings(), { wrapper });
    act(() => {
      result.current.handleChangeDatePicker(new Date(tomorrow));
    });

    const currentDate2 = new Date();
    const night = currentDate2.setHours(0, 0, 0);
    act(() => {
      result.current.handleChangeTimePicker(new Date(night));
    });

    // when change time, keep date of previous state then set only selected time like mixed date bellow
    const tomorrowDate = new Date(tomorrow);
    const mixed = tomorrowDate.setHours(0, 0, 0, 0);

    const date = new Date(result.current.sImportant?.expires_time || '');
    expect(date.toISOString()).toEqual(new Date(mixed).toISOString());
  });

  it('should update state important hour as min date when not selected date and selected hour smaller than now', () => {
    const currentDate = new Date();
    const night = currentDate.setHours(0, 0, 0);

    const store = createTestStore(storeData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(() => usePostSettings(), { wrapper });

    act(() => {
      result.current.handleChangeTimePicker(new Date(night));
    });

    const date = new Date(result.current.sImportant?.expires_time || '');
    expect(date.toISOString()).not.toEqual(new Date(night).toISOString());
  });

  it('should putUpdateSettings when press save', () => {
    const store = createTestStore(storeData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(
      () => usePostSettings({ postId: POST_DETAIL.id }),
      { wrapper },
    );
    let action;
    act(() => {
      action = result.current.handlePressSave();
    });
    expect(action).toBe('putUpdateSettings');
  });

  it('should doNothing when handlePutUpdateSettings without post data', () => {
    const storeData: any = {
      ...initialState,
      // post: {[POST_DETAIL.id]: POST_DETAIL},
    };
    const store = createTestStore(storeData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(
      () => usePostSettings({ postId: POST_DETAIL.id }),
      { wrapper },
    );
    let actionResult;
    act(() => {
      actionResult = result.current.handlePutUpdateSettings();
    });
    expect(actionResult).toBe('doNothing');
  });

  it('should doNothing when handlePutUpdateSettings with post data', () => {
    const storeData: any = {
      ...initialState,
      post: {
        allPosts: { [POST_DETAIL.id]: POST_DETAIL },
        createPost: {
          currentSettings: {
            active: false,
            expires_time: '',
          },
          important: {
            active: false,
            expires_time: '',
          },
        },
      },
    };
    const store = createTestStore(storeData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(
      () => usePostSettings({ postId: POST_DETAIL.id }),
      { wrapper },
    );
    let actionResult;
    act(() => {
      actionResult = result.current.handlePutUpdateSettings();
    });
    expect(actionResult).toBe('dispatchPutEditPost');
  });
});
