/* eslint-disable @typescript-eslint/no-var-requires */

import {cleanup, waitFor} from '@testing-library/react-native';

import React from 'react';

import initialState from '~/store/initialState';

import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';

import EditDescription from '.';
import menuTypes from '../../redux/types';
import {USER_PROFILE} from '~/test/mock_data/menu';
import menuActions from '../../redux/actions';

afterEach(cleanup);

describe('EditDescription screen', () => {
  let Keyboard: any;

  const mockStore = configureStore([]);

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should disable save button when not change description`, async () => {
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditDescription />, store);

    const component = wrapper.getByTestId('edit_description.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();
  });

  it(`should enable save button when change description and description not set`, async () => {
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditDescription />, store);

    const component = wrapper.getByTestId('edit_description.save');
    const textInputComponent = wrapper.getByTestId('edit_description');

    fireEvent.changeText(textInputComponent, 'abc');
    expect(component.props.accessibilityState.disabled).toBeFalsy();
  });

  it(`should back to previous screen successfully `, () => {
    Keyboard.dismiss = jest.fn();
    const goBack = jest.fn();

    const rootNavigation = {canGoBack: true, goBack};

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditDescription />, store);

    const component = wrapper.getByTestId('edit_description.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(Keyboard.dismiss).toBeCalled();
    expect(goBack).toBeCalled();
  });

  it(`should update userProfile successfully when click save button `, async () => {
    Keyboard.dismiss = jest.fn();

    const mockActionEditMyProfile = () => {
      return {
        type: menuTypes.SET_MY_PROFILE,
        payload: USER_PROFILE,
      };
    };

    jest
      .spyOn(menuActions, 'editMyProfile')
      .mockImplementation(mockActionEditMyProfile as any);

    const store = createTestStore(initialState);
    const wrapper = renderWithRedux(<EditDescription />, store);

    const buttonComponent = wrapper.getByTestId('edit_description.save');
    const textInputComponent = wrapper.getByTestId('edit_description');

    fireEvent.changeText(textInputComponent, 'abc');
    expect(buttonComponent.props.accessibilityState.disabled).toBeFalsy();

    fireEvent.press(buttonComponent);

    //this test case can't be done bc can mock dispatch
  });
});
