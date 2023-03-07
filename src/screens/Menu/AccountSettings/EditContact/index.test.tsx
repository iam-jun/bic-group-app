/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';

import lodash from 'lodash';
import {
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';

import EditContact from './index';
import useCommonController from '~/screens/store';
import useUserProfileStore from '../../UserProfile/store';
import { responseGetCity } from '../../UserProfile/store/__mocks__/data';
import useMenuController from '../../store';

const fakeProfile = {
  id: 'test_id',
  countryCode: '+84',
  phone: '8987123465',
  city: 'Bến Tre',
  country: 'Việt Nam',
  email: 'thuquyen@tgm.vn',
};

const fakeCountry = [{
  countryCode: '+84',
  flag: '🇻🇳',
  isoCode: 'VN',
  name: 'Việt Nam',
}];

describe('Edit Contact screen', () => {
  let Keyboard: any;

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should disable save button when not change contact info', () => {
    useCommonController.setState((state) => {
      state.myProfile = fakeProfile;
      return state;
    });
    const wrapper = renderWithRedux(<EditContact />);

    const buttonSave = wrapper.getByTestId('edit_contact.save');
    expect(buttonSave.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should enable save button when change country code', () => {
    useCommonController.setState((state) => {
      state.myProfile = {
        id: 'test_id',
        country: 'Việt Nam',
        email: 'thuquyen@tgm.vn',
      };
      return state;
    });

    useUserProfileStore.setState((state) => {
      state.country = fakeCountry;
      return state;
    });

    const wrapper = renderWithRedux(<EditContact />);

    const buttonSave = wrapper.getByTestId('edit_contact.save');
    expect(buttonSave.props.accessibilityState.disabled).toBeTruthy();

    const conutryCodeComponent = wrapper.getByTestId(
      'edit_phone_number.country_code',
    );
    fireEvent.press(conutryCodeComponent);

    const listCountryCodeComp = wrapper.queryAllByTestId('edit_phone_number.country_code.item');
    expect(listCountryCodeComp.length).toEqual(fakeCountry.length);
    fireEvent.press(listCountryCodeComp[0]);

    expect(buttonSave.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should enable save button when change location ', () => {
    useCommonController.setState((state) => {
      state.myProfile = fakeProfile;
      return state;
    });
    useUserProfileStore.setState((state) => {
      state.city = responseGetCity.data as any;
      return state;
    });

    const wrapper = renderWithRedux(<EditContact />);
    jest.useFakeTimers();

    const buttonSave = wrapper.getByTestId('edit_contact.save');
    expect(buttonSave.props.accessibilityState.disabled).toBeTruthy();

    const buttonLocationComponent = wrapper.getByTestId(
      'edit_contact.location',
    );
    fireEvent.press(buttonLocationComponent);

    const searchInput = wrapper.getByTestId('edit_location.search');
    expect(searchInput).toBeDefined();
    fireEvent.changeText(searchInput, 'An ');
    jest.runAllTimers();
    const listItems = wrapper.queryAllByTestId('edit_location.item');
    expect(listItems.length).toBeGreaterThanOrEqual(1);
    fireEvent.press(listItems[0]);

    expect(buttonSave.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should back to previous screen successfully ', () => {
    Keyboard.dismiss = jest.fn();
    const goBack = jest.fn();
    const rootNavigation = { canGoBack: true, goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<EditContact />);

    const buttonSave = wrapper.getByTestId('edit_contact.save');
    expect(buttonSave.props.accessibilityState.disabled).toBeTruthy();

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(Keyboard.dismiss).toBeCalled();
    expect(goBack).toBeCalled();
  });

  it('should disable email input', () => {
    useCommonController.setState((state) => {
      state.myProfile = fakeProfile;
      return state;
    });
    const wrapper = renderWithRedux(<EditContact />);

    const emailInput = wrapper.getByTestId('edit_contact.email');
    expect(emailInput.props?.editable).toBeFalsy();
  });

  it('should back to previous screen successfully when click save button', () => {
    const spy = jest.spyOn(lodash, 'debounce');

    useUserProfileStore.setState((state) => {
      state.city = responseGetCity.data as any;
      return state;
    });
    const goBack = jest.fn();
    const rootNavigation = { canGoBack: true, goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const editMyProfile = jest.fn();
    useMenuController.setState((state) => {
      state.actions.editMyProfile = editMyProfile;
      return state;
    });

    const wrapper = renderWithRedux(<EditContact />);

    jest.useFakeTimers();

    const buttonSave = wrapper.getByTestId('edit_contact.save');
    expect(buttonSave.props.accessibilityState.disabled).toBeTruthy();

    const buttonLocationComponent = wrapper.getByTestId(
      'edit_contact.location',
    );
    fireEvent.press(buttonLocationComponent);

    const searchInput = wrapper.getByTestId('edit_location.search');
    expect(searchInput).toBeDefined();
    fireEvent.changeText(searchInput, 'An ');

    jest.runAllTimers();

    const listItems = wrapper.queryAllByTestId('edit_location.item');
    expect(listItems.length).toBeGreaterThanOrEqual(1);
    fireEvent.press(listItems[0]);

    expect(buttonSave.props.accessibilityState.disabled).toBeFalsy();

    jest.useFakeTimers();

    fireEvent.press(buttonSave);

    expect(spy).toBeCalled();
    jest.runAllTimers();
    expect(editMyProfile).toBeCalled();
  });
});
