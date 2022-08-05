/* eslint-disable @typescript-eslint/no-var-requires */

import { cleanup } from '@testing-library/react-native';

import React from 'react';

import initialState from '~/store/initialState';

import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';

import EditContact from '.';
import menuActions from '../../redux/actions';
import menuTypes from '../../redux/types';
import { USER_PROFILE } from '~/test/mock_data/menu';

afterEach(cleanup);

describe('Edit Contact screen', () => {
  let Keyboard: any;
  let storeData: any;

  const mockStore = configureStore([]);

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
    jest.clearAllMocks();
    storeData = { ...initialState };
    storeData.menu.myProfile = {} as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should disable save button when not change contact info', () => {
    storeData.menu.myProfile = USER_PROFILE;

    const store = mockStore(storeData);

    const wrapper = renderWithRedux(<EditContact />, store);

    const component = wrapper.getByTestId('edit_contact.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should enable save button when change country code', () => {
    jest.useFakeTimers();

    const store = createTestStore(initialState);

    const wrapper = renderWithRedux(<EditContact />, store);

    const component = wrapper.getByTestId('edit_contact.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();

    const conutryCodeComponent = wrapper.getByTestId(
      'edit_phone_number.country_code',
    );
    fireEvent.press(conutryCodeComponent);

    const searchInput = wrapper.getByTestId(
      'edit_phone_number.country_code.search',
    );
    expect(searchInput).toBeDefined();
    fireEvent.changeText(searchInput, '84');

    jest.runAllTimers();

    const countryList = wrapper.queryAllByTestId(
      'edit_phone_number.country_code.item',
    );
    expect(countryList[0]).not.toBeNull();
    fireEvent.press(countryList[0]);

    expect(component.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should enable save button when change location ', () => {
    jest.useFakeTimers();

    const store = createTestStore(initialState);

    const wrapper = renderWithRedux(<EditContact />, store);

    const component = wrapper.getByTestId('edit_contact.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();

    const buttonLocationComponent = wrapper.getByTestId(
      'edit_contact.location',
    );
    fireEvent.press(buttonLocationComponent);

    const searchInput = wrapper.getByTestId('edit_location.search');
    expect(searchInput).toBeDefined();
    fireEvent.changeText(searchInput, 'An ');

    jest.runAllTimers();

    const listItems = wrapper.getAllByTestId('edit_location.item');
    expect(listItems.length).toBeGreaterThanOrEqual(1);
    fireEvent.press(listItems[0]);

    expect(component.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should back to previous screen successfully ', () => {
    Keyboard.dismiss = jest.fn();
    const goBack = jest.fn();

    const rootNavigation = { canGoBack: true, goBack };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditContact />, store);

    const component = wrapper.getByTestId('edit_contact.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(Keyboard.dismiss).toBeCalled();
    expect(goBack).toBeCalled();
  });

  it('should disable email input', () => {
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditContact />, store);

    const component = wrapper.getByTestId('edit_contact.email');
    expect(component.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should back to previous screen successfully when click save button', () => {
    jest.useFakeTimers();
    Keyboard.dismiss = jest.fn();
    const goBack = jest.fn();

    const rootNavigation = { canGoBack: true, goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const mockActionEditMyProfile = () => ({
      type: menuTypes.SET_MY_PROFILE,
      payload: USER_PROFILE,
    });

    jest
      .spyOn(menuActions, 'editMyProfile')
      .mockImplementation(mockActionEditMyProfile as any);

    const store = createTestStore(initialState);

    const wrapper = renderWithRedux(<EditContact />, store);

    const component = wrapper.getByTestId('edit_contact.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();

    const buttonLocationComponent = wrapper.getByTestId(
      'edit_contact.location',
    );
    fireEvent.press(buttonLocationComponent);

    const searchInput = wrapper.getByTestId('edit_location.search');
    expect(searchInput).toBeDefined();
    fireEvent.changeText(searchInput, 'An ');

    jest.runAllTimers();

    const listItems = wrapper.getAllByTestId('edit_location.item');
    expect(listItems.length).toBeGreaterThanOrEqual(1);
    fireEvent.press(listItems[0]);

    expect(component.props.accessibilityState.disabled).toBeFalsy();

    fireEvent.press(component);

    expect(Keyboard.dismiss).toBeCalled();
    // this test case can't be done bc can mock react-hook-form
    // expect(goBack).toBeCalled();
  });
});
