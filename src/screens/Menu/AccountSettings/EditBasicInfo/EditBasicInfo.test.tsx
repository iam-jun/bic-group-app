/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { cleanup, waitFor } from '@testing-library/react-native';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';

import EditBasicInfo from './EditBasicInfo';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';
import useModalStore from '~/store/modal';
import useCommonController from '~/screens/store';
import { GENDER_TYPE, RELATIONSHIP_TYPE } from '~/interfaces/IEditUser';
import i18n from '~/localization';

afterEach(cleanup);

const fakeDataUserProfile = {
  id: 'test_id',
  fullname: 'Full Name',
  username: 'User Name',
  gender: GENDER_TYPE.MALE,
  birthday: '01/08/1998',
  relationshipStatus: RELATIONSHIP_TYPE.SINGLE,
  language: ['en', 'vi'],
};

describe('EditBasicInfo screen', () => {
  let Keyboard: any;
  const mockLanguages = [
    { code: 'en', local: 'English', selected: true },
    { code: 'vi', local: 'Tiếng Việt', selected: true },
  ];

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
    jest.clearAllMocks();
  });

  it('should disable save button when not change any value', async () => {
    const wrapper = renderWithRedux(<EditBasicInfo />);

    const component = wrapper.getByTestId('edit_basic_info.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should enable save button when change name', async () => {
    const wrapper = renderWithRedux(<EditBasicInfo />);

    const component = wrapper.getByTestId('edit_basic_info.save');
    const inputComponent = wrapper.getByTestId(
      'edit_basic_info.name.text_input',
    );

    fireEvent.changeText(inputComponent, 'Test name');
    expect(component.props.accessibilityState.disabled).toBeFalsy();

    fireEvent.press(component);
  });

  it('should enable save button when change gender', async () => {
    const wrapper = renderWithRedux(<EditBasicInfo />);

    const maleComponent = wrapper.getByTestId('settings.male');
    expect(maleComponent).toBeDefined();

    fireEvent.press(maleComponent);

    const buttonSave = wrapper.getByTestId('edit_basic_info.save');
    expect(buttonSave?.props?.accessibilityState?.disabled).toBeTruthy();
  });

  it('should render show date picker when click birthday item', async () => {
    const wrapper = renderWithRedux(<EditBasicInfo />);

    const component = wrapper.getByTestId('edit_basic_info.birthday');
    expect(component).toBeDefined();
    fireEvent.press(component);

    await waitFor(() => expect(wrapper.queryByTestId('date_input.date_picker')).toBeTruthy());
  });

  it('should render language option bottom sheet and enable Save button when click language item', () => {
    useUserProfileStore.setState((state) => {
      state.languages = mockLanguages;
      return state;
    });

    const wrapper = renderWithRedux(<EditBasicInfo />);

    const languageComponent = wrapper.getByTestId('edit_basic_info.language');
    expect(languageComponent).toBeDefined();

    fireEvent.press(languageComponent);

    const languageBottomSheetCom = wrapper.queryByTestId(
      'language.bottom_sheet',
    );
    expect(languageBottomSheetCom).toBeDefined();

    const languageItemsComp = wrapper.queryAllByTestId(
      'language_option.item_list',
    );
    expect(languageItemsComp).toBeDefined();
    expect(languageItemsComp.length).toEqual(mockLanguages.length);

    fireEvent.press(languageItemsComp[0]);

    const buttonSave = wrapper.getByTestId('edit_basic_info.save');
    expect(buttonSave).toBeDefined();
  });

  it('should render relationship bottom sheet when click relationship item', async () => {
    const wrapper = renderWithRedux(<EditBasicInfo />);

    const buttonSave = wrapper.getByTestId('edit_basic_info.save');
    expect(buttonSave?.props?.accessibilityState?.disabled).toBeTruthy();

    const component = wrapper.getByTestId('edit_basic_info.relationship');
    expect(component).toBeDefined();

    fireEvent.press(component);

    const bottomSheet = wrapper.getByTestId(
      'edit_basic_info.relationship_status_list',
    );

    expect(bottomSheet).toBeDefined();
  });

  it('should back to previous screen successfully ', () => {
    const goBack = jest.fn();

    const rootNavigation = { canGoBack: true, goBack };

    jest
      .spyOn(navigationHook, 'useRootNavigation')
      .mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<EditBasicInfo />);

    const component = wrapper.getByTestId('edit_basic_info.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(goBack).toBeCalled();
  });

  it('should show alert when changed value and click back ', () => {
    Keyboard.dismiss = jest.fn();
    const showAlert = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showAlert } as any;
      return state;
    });

    const wrapper = renderWithRedux(<EditBasicInfo />);

    const inputComponent = wrapper.getByTestId(
      'edit_basic_info.name.text_input',
    );

    fireEvent.changeText(inputComponent, 'Test name');

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(Keyboard.dismiss).toBeCalled();
    expect(showAlert).toBeCalled();
  });

  it('should show error text when deleting all character of name', () => {
    useCommonController.setState((state) => {
      state.myProfile = fakeDataUserProfile as any;
      return state;
    });

    const wrapper = renderWithRedux(<EditBasicInfo />);

    const inputComponent = wrapper.getByTestId(
      'edit_basic_info.name.text_input',
    );

    fireEvent.changeText(inputComponent, '');

    const helperComponent = wrapper.getByTestId('text_input.text_helper');
    expect(helperComponent).toBeDefined();
    expect(helperComponent.props?.children?.[0]).toBe(
      i18n.t('profile:text_name_must_not_be_empty'),
    );
  });
});
