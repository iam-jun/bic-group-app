import { cleanup } from '@testing-library/react-native';
import * as React from 'react';
import { renderWithRedux, configureStore } from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import Button from '.';

afterEach(cleanup);

describe('Button component', () => {
  const mockStore = configureStore([]);

  const storeData = { ...initialState };

  storeData.noInternet.isInternetReachable = true;

  const store = mockStore(storeData);

  it('renders correctly', () => {
    const rendered = renderWithRedux(<Button />, store).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly button when no internet connection', () => {
    storeData.noInternet.isInternetReachable = false;

    const store = mockStore(storeData);
    const rendered = renderWithRedux(<Button />, store);
    const { getByTestId } = rendered;
    const btnComponent = getByTestId('button_wrapper');

    expect(btnComponent.props?.accessibilityState?.disabled).toBe(true);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
