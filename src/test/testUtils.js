import React from 'react';
import {
  act, render, cleanup, fireEvent,
} from '@testing-library/react-native';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  withReanimatedTimer,
  advanceAnimationByTime,
  advanceAnimationByFrame,
  getAnimatedStyle,
} from 'react-native-reanimated/src/reanimated2/jestUtils';

// WARNING: Don't remove this import
import '~/store';

import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import initialState from '~/store/initialState';
import { appReducer } from '~/store/reducers';

const languages = require('~/localization/en.json');

const mockStore = configureStore([]);
const defaultStore = mockStore(initialState);

function createTestStore(state = initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = compose(applyMiddleware(sagaMiddleware));
  return createStore(appReducer, state, enhancer);
  // return Store.store;
}

export function renderWithRedux(component, store = createTestStore()) {
  return render(<Provider store={store}>{component}</Provider>);
}

export function rerenderWithRedux(
  wrapper,
  component,
  store = createTestStore(),
) {
  return wrapper?.rerender?.(<Provider store={store}>{component}</Provider>);
}

// eslint-disable-next-line no-promise-executor-return
const waitForUpdateRedux = (timeout = 500) => new Promise((r) => setTimeout(r, timeout));

const getHookReduxWrapper = (store = createTestStore()) => {
  const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  return wrapper;
};

// must use React.useState
const setHookTestState = (newState) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const setStateMockFn = () => {};
  return Object.keys(newState).reduce((acc, val) => {
    // eslint-disable-next-line no-param-reassign
    acc = acc?.mockImplementationOnce(() => [newState[val], setStateMockFn]);
    return acc;
  }, jest.fn());
};

export * from '@testing-library/react-native';
export {
  defaultStore as store,
  cleanup,
  fireEvent,
  configureStore,
  withReanimatedTimer,
  advanceAnimationByTime,
  advanceAnimationByFrame,
  getAnimatedStyle,
  languages,
  act,
  createTestStore,
  waitForUpdateRedux,
  renderHook,
  getHookReduxWrapper,
  setHookTestState,
};
