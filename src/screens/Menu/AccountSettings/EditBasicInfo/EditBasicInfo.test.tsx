/* eslint-disable @typescript-eslint/no-var-requires */

import { cleanup, waitFor } from '@testing-library/react-native';

import React from 'react';

import i18next from 'i18next';
import initialState from '~/store/initialState';

import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';

import EditBasicInfo from './EditBasicInfo';
import { USER_PROFILE } from '~/test/mock_data/menu';

afterEach(cleanup);

describe('EditDescription screen', () => {
  let Keyboard: any;
  let storeData: any;

  const mockStore = configureStore([]);

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
    jest.clearAllMocks();
    storeData = { ...initialState };
    storeData.menu.myProfile = {} as any;
    storeData.auth.user = {} as any;
    storeData.menu.showUserNotFound = false;
    storeData.menu.loadingUserProfile = false;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should disable save button when not change any value', async () => {
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should enable save button when change name', async () => {
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.save');
    const inputComponent = wrapper.getByTestId('edit_name.text_input');

    fireEvent.changeText(inputComponent, 'Test name');
    expect(component.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should render gender bottom sheet when click gender item', async () => {
    Keyboard.dismiss = jest.fn();

    storeData.menu.myProfile = USER_PROFILE;
    const store = mockStore(storeData);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const buttonSave = wrapper.getByTestId('edit_basic_info.save');
    expect(buttonSave?.props?.accessibilityState?.disabled).toBeTruthy();

    const component = wrapper.getByTestId('edit_basic_info.gender');
    expect(component).toBeDefined();

    fireEvent.press(component);
    expect(Keyboard.dismiss).toBeCalled();
    const bottomSheet = wrapper.getByTestId('edit_basic_info.gender_list');
    expect(bottomSheet).toBeDefined();

    const item0Component = wrapper.getByTestId(
      'edit_user_info.option_menu.item_MALE',
    );
    expect(item0Component).toBeDefined();
    fireEvent.press(item0Component);

    expect(buttonSave?.props?.accessibilityState?.disabled).toBeFalsy();
  });

  it('should render show date picker when click birthday item', async () => {
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.birthday');
    expect(component).toBeDefined();
    fireEvent.press(component);

    await waitFor(() => expect(wrapper.queryByTestId('edit_basic_info.date_picker')).toBeTruthy());
  });

  it('should render language option bottom sheet and enable Save button when click language item', () => {
    const user = {
      signInUserSession: {
        idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
      },
    };
    Keyboard.dismiss = jest.fn();

    const storeData = { ...initialState };
    storeData.auth.user = user as any;
    storeData.menu.myProfile = USER_PROFILE as any;
    const store = createTestStore(storeData);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.language');
    expect(component).toBeDefined();

    fireEvent.press(component);
    expect(Keyboard.dismiss).toBeCalled();

    const item0Component = wrapper.getByTestId(
      'language_option_menu.checkbox.item_0',
    );
    expect(item0Component).toBeDefined();

    fireEvent.press(item0Component);

    const btnSaveComponent = wrapper.getByTestId(
      'edit_basic_info.save_language',
    );
    expect(btnSaveComponent).toBeDefined();
    fireEvent.press(btnSaveComponent);

    const buttonSave = wrapper.getByTestId('edit_basic_info.save');
    expect(buttonSave).toBeDefined();

    expect(buttonSave.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should render relationship bottom sheet when click relationship item', () => {
    Keyboard.dismiss = jest.fn();
    const user = {
      signInUserSession: {
        idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
      },
    };

    const storeData = { ...initialState };
    storeData.auth.user = user as any;
    storeData.menu.myProfile = USER_PROFILE as any;
    const store = createTestStore(storeData);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const buttonSave = wrapper.getByTestId('edit_basic_info.save');
    expect(buttonSave?.props?.accessibilityState?.disabled).toBeTruthy();

    const component = wrapper.getByTestId('edit_basic_info.relationship');
    expect(component).toBeDefined();

    fireEvent.press(component);
    expect(Keyboard.dismiss).toBeCalled();

    const bottomSheet = wrapper.getByTestId(
      'edit_basic_info.relationship_status_list',
    );

    expect(bottomSheet).toBeDefined();

    const item0Component = wrapper.getByTestId(
      'edit_user_info.option_menu.item_MARRIED',
    );
    expect(item0Component).toBeDefined();
    fireEvent.press(item0Component);

    expect(buttonSave?.props?.accessibilityState?.disabled).toBeFalsy();
  });

  it('should back to previous screen successfully ', () => {
    const goBack = jest.fn();

    const rootNavigation = { canGoBack: true, goBack };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(goBack).toBeCalled();
  });

  it('should show alert when changed value and click back ', () => {
    Keyboard.dismiss = jest.fn();

    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const inputComponent = wrapper.getByTestId('edit_name.text_input');

    fireEvent.changeText(inputComponent, 'Test name');

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(Keyboard.dismiss).toBeCalled();
  });

  it('should dismiss keyboard when click button save ', () => {
    Keyboard.dismiss = jest.fn();

    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const inputComponent = wrapper.getByTestId('edit_name.text_input');

    fireEvent.changeText(inputComponent, 'Test name');

    const buttonSave = wrapper.getByTestId('edit_basic_info.save');
    expect(buttonSave.props.accessibilityState.disabled).toBeFalsy();

    fireEvent.press(buttonSave);

    expect(Keyboard.dismiss).toBeCalled();
  });

  it('should show error text when deleting all character of name', () => {
    Keyboard.dismiss = jest.fn();

    storeData.menu.myProfile = USER_PROFILE;
    const store = mockStore(storeData);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const inputComponent = wrapper.getByTestId('edit_name.text_input');

    fireEvent.changeText(inputComponent, '');

    const helperComponent = wrapper.getByTestId('text_input.text_helper');
    expect(helperComponent).toBeDefined();
    expect(helperComponent.props?.children?.[0]).toBe(
      i18next.t('profile:text_name_must_not_be_empty'),
    );
  });
});
