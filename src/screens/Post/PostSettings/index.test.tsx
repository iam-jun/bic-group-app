import React from 'react';

import {createTestStore, fireEvent, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import PostSettings from '~/screens/Post/PostSettings/index';
import {colors} from '~/theme';
import * as navigationHook from '~/hooks/navigation';
import modalActions from '~/store/modal/actions';

describe('Post Setting Screen', () => {
  const storeData = {...initialState};
  storeData.post.createPost.currentSettings = {
    active: false,
    expires_time: '',
  } as any;
  storeData.post.createPost.important = {
    active: false,
    expires_time: '',
  } as any;

  it(`renders correctly default setting`, async () => {
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    const btnSave = wrapper.getByTestId('post_settings.btn_save');
    expect(btnSave?.props?.accessibilityState?.disabled).toBe(true);

    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important.out_side_view',
    );
    expect(toggleImportant?.props?.style?.backgroundColor).toEqual(
      colors.light.colors.borderCard,
    );
  });

  it(`renders correctly disable to enable important`, async () => {
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    const btnSave = wrapper.getByTestId('post_settings.btn_save');
    expect(btnSave?.props?.accessibilityState?.disabled).toBe(true);

    const toggleImportantView = wrapper.getByTestId(
      'post_settings.toggle_important.out_side_view',
    );
    expect(toggleImportantView?.props?.style?.backgroundColor).toEqual(
      colors.light.colors.borderCard,
    );

    //active important
    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important',
    );
    fireEvent.press(toggleImportant);

    expect(btnSave?.props?.accessibilityState?.disabled).toBe(false);
    expect(toggleImportantView?.props?.style?.backgroundColor).toEqual(
      colors.light.colors.success,
    );
  });

  it('should show navigate back when press back without changed', () => {
    const navigate = jest.fn();
    const goBack = jest.fn();
    const rootNavigation = {navigate, goBack};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

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

    //active important
    const toggleImportant = wrapper.getByTestId(
      'post_settings.toggle_important',
    );
    fireEvent.press(toggleImportant);

    const btnBack = wrapper.getByTestId('header.back.button');
    fireEvent.press(btnBack);

    expect(spy).toBeCalled();
  });

  it('should render important date picker when press important date', () => {
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<PostSettings />, store);

    //active important
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

    //active important
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
});
