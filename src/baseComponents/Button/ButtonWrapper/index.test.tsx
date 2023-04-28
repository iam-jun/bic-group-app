import { cleanup } from '@testing-library/react-native';
import * as React from 'react';
import useNetworkStore, { INetworkState } from '~/store/network';
import { renderWithRedux } from '~/test/testUtils';
import Button from '.';

afterEach(cleanup);

describe('Button component', () => {
  it('renders correctly', () => {
    useNetworkStore.setState((state:INetworkState) => {
      state.isInternetReachable = true;
      return state;
    });

    const rendered = renderWithRedux(<Button />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly button when no internet connection', () => {
    useNetworkStore.setState((state:INetworkState) => {
      state.isInternetReachable = false;
      return state;
    });

    const rendered = renderWithRedux(<Button />);
    const { getByTestId } = rendered;
    const btnComponent = getByTestId('button_wrapper');

    expect(btnComponent.props?.accessibilityState?.disabled).toBe(true);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
