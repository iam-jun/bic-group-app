/* eslint-disable @typescript-eslint/no-var-requires */

import {cleanup, waitFor} from '@testing-library/react-native';

import React from 'react';

import initialState from '~/store/initialState';

import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
  waitForUpdateRedux,
} from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';

import EditDescription from '.';
import menuDataHelper from '../../helper/MenuDataHelper';

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

  it(`should back to `, async () => {
    Keyboard.dismiss = jest.fn();
    const store = createTestStore(initialState);

    const wrapper = renderWithRedux(<EditDescription />, store);

    const buttonComponent = wrapper.getByTestId('edit_description.save');
    const textInputComponent = wrapper.getByTestId('edit_description');

    fireEvent.changeText(textInputComponent, 'abc');
    expect(buttonComponent.props.accessibilityState.disabled).toBeFalsy();

    const goBack = jest.fn();
    const rootNavigation = {canGoBack: true, goBack};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    jest.spyOn(menuDataHelper, 'editMyProfile').mockImplementation(() => {
      return Promise.resolve({
        code: 200,
        data: {
          id: 58,
          description: 'Fake fake description',
        },
        meta: {},
      });
    });

    fireEvent.press(buttonComponent);

    // await waitFor(() =>
    //   expect(wrapper.queryByTestId('edit_description')).toBeTruthy(),
    // );
    // await waitForUpdateRedux();

    // expect(Keyboard.dismiss).toBeCalled();
    // expect(goBack).toBeCalled();
  });
});
