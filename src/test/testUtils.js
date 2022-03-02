import React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import initialState from '~/store/initialState';
import {act} from 'react-test-renderer';

const mockStore = configureStore([]);
const defaultStore = mockStore(initialState);

export function renderWithRedux(component, store = defaultStore) {
  return render(<Provider store={store}>{component}</Provider>);
}

export * from '@testing-library/react-native';
export {defaultStore as store, cleanup, fireEvent, configureStore};

export const waitForComponentToPaint = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve));
    wrapper.update();
  });
};
