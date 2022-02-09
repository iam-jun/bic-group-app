import React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import initialState from '~/store/initialState';

const mockStore = configureStore([]);
const defaultStore = mockStore(initialState);

export function renderWithRedux(component, store = defaultStore) {
  return render(<Provider store={store}>{component}</Provider>);
}

export * from '@testing-library/react-native';
export {defaultStore as store, cleanup, fireEvent, configureStore};
