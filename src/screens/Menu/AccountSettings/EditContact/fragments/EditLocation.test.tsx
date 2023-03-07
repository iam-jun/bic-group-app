import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import EditLocation from './EditLocation';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';
import { responseGetCity } from '~/screens/Menu/UserProfile/store/__mocks__/data';

describe('EditLocation conponent', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  const modalizeRef = null;

  it('should call prop onItemPress', () => {
    const onPress = jest.fn();
    useUserProfileStore.setState((state) => {
      state.city = responseGetCity.data as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <EditLocation modalizeRef={modalizeRef} onItemPress={onPress} />,
    );

    const listItems = wrapper.getAllByTestId('edit_location.item');
    fireEvent.press(listItems[0]);

    expect(onPress).toHaveBeenCalled();
  });

  it('should renders correctly result when typing search', () => {
    jest.useFakeTimers();
    useUserProfileStore.setState((state) => {
      state.city = responseGetCity.data as any;
      return state;
    });

    const onPress = jest.fn();

    const wrapper = renderWithRedux(
      <EditLocation modalizeRef={modalizeRef} onItemPress={onPress} />,
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
    const onPress = jest.fn();
    useUserProfileStore.setState((state) => {
      state.city = responseGetCity.data as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <EditLocation modalizeRef={modalizeRef} onItemPress={onPress} />,
    );

    const searchInput = wrapper.getByTestId('edit_location.search');
    expect(searchInput).toBeDefined();

    fireEvent.changeText(searchInput, 'An adsfjlwf lkwjelf jlejfljelfk');

    jest.runAllTimers();

    const listItems = wrapper.queryAllByTestId('edit_location.item');
    expect(listItems.length).toBe(0);
  });
});
