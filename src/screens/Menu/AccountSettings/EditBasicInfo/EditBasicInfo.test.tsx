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

import EditBasicInfo from './EditBasicInfo';
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

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.save');
    expect(component.props.accessibilityState.disabled).toBeTruthy();
  });

  it(`should enable save button when change name`, async () => {
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.save');
    const inputComponent = wrapper.getByTestId('edit_name.text_input');

    fireEvent.changeText(inputComponent, 'Test name');
    expect(component.props.accessibilityState.disabled).toBeFalsy();
  });

  it(`should render gender bottom sheet when click gender item`, async () => {
    Keyboard.dismiss = jest.fn();
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.gender');
    expect(component).toBeDefined();

    fireEvent.press(component);
    expect(Keyboard.dismiss).toBeCalled();
    //   const bottomSheet = wrapper.getByTestId(
    //     'edit_basic_info.gender_list',
    //   );

    //   fireEvent.changeText(inputCompoent, 'Test name');
    //   expect(component.props.accessibilityState.disabled).toBeFalsy();
  });

  it(`should render show date picker when click birthday item`, async () => {
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.birthday');
    expect(component).toBeDefined();
    fireEvent.press(component);

    await waitFor(() =>
      expect(wrapper.queryByTestId('edit_basic_info.date_picker')).toBeTruthy(),
    );
    //   const datePicker = wrapper.getByTestId('edit_basic_info.date_picker');

    //   fireEvent.changeText(datePicker, 'Test name');
    //   expect(component.props.accessibilityState.disabled).toBeFalsy();
  });

  it(`should render language option bottom sheet when click language item`, async () => {
    Keyboard.dismiss = jest.fn();
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.language');
    expect(component).toBeDefined();

    fireEvent.press(component);
    expect(Keyboard.dismiss).toBeCalled();
    //   const bottomSheet = wrapper.getByTestId(
    //     'edit_basic_info.gender_list',
    //   );

    //   fireEvent.changeText(inputCompoent, 'Test name');
    //   expect(component.props.accessibilityState.disabled).toBeFalsy();
  });

  it(`should render relationship bottom sheet when click relationship item`, async () => {
    Keyboard.dismiss = jest.fn();
    const store = mockStore(initialState);

    const wrapper = renderWithRedux(<EditBasicInfo />, store);

    const component = wrapper.getByTestId('edit_basic_info.relationship');
    expect(component).toBeDefined();

    fireEvent.press(component);
    expect(Keyboard.dismiss).toBeCalled();

    const bottomSheet = wrapper.getByTestId(
      'edit_basic_info.relationship_status_list',
    );

    expect(bottomSheet).toBeDefined();
  });
});
