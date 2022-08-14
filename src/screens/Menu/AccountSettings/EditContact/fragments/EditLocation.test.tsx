import React from 'react';

import { cleanup } from '@testing-library/react-native';
import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import EditLocation from './EditLocation';
import initialState from '~/storeRedux/initialState';

afterEach(cleanup);

describe('EditLocation conponent', () => {
  let Platform: any;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  const modalizeRef = null;
  const mockStore = configureStore([]);

  it('should call prop onItemPress', () => {
    const store = mockStore(initialState);
    const onPress = jest.fn();

    const wrapper = renderWithRedux(
      <EditLocation modalizeRef={modalizeRef} onItemPress={onPress} />,
      store,
    );

    const listItems = wrapper.getAllByTestId('edit_location.item');
    fireEvent.press(listItems[0]);

    expect(onPress).toHaveBeenCalled();
  });

  it('should renders correctly result when typing search', () => {
    Platform.OS = 'android';
    jest.useFakeTimers();
    const store = createTestStore(initialState);
    const onPress = jest.fn();

    const wrapper = renderWithRedux(
      <EditLocation modalizeRef={modalizeRef} onItemPress={onPress} />,
      store,
    );

    const searchInput = wrapper.getByTestId('edit_location.search');
    expect(searchInput).toBeDefined();

    fireEvent.changeText(searchInput, 'An G');

    jest.runAllTimers();

    const listItems = wrapper.getAllByTestId('edit_location.item');
    expect(listItems.length).toBe(1);
  });

  it('should renders no result when typing words with no meaning ', () => {
    jest.useFakeTimers();
    const store = createTestStore(initialState);
    const onPress = jest.fn();

    const wrapper = renderWithRedux(
      <EditLocation modalizeRef={modalizeRef} onItemPress={onPress} />,
      store,
    );

    const searchInput = wrapper.getByTestId('edit_location.search');
    expect(searchInput).toBeDefined();

    fireEvent.changeText(searchInput, 'An adsfjlwf lkwjelf jlejfljelfk');

    jest.runAllTimers();

    const listItems = wrapper.queryAllByTestId('edit_location.item');
    expect(listItems.length).toBe(0);
  });
});
