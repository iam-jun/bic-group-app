import React from 'react';
import useNetworkStore, { INetworkState } from '~/store/network';
import Icon from './index';
import { renderWithRedux } from '~/test/testUtils';

describe('Icon component', () => {
  it('should clickable when have onPress', () => {
    useNetworkStore.setState((state:INetworkState) => {
      state.isInternetReachable = true;
      return state;
    });
    const rendered = renderWithRedux(<Icon icon="AngleRight" onPress={jest.fn()} buttonTestID="button_arrow" />);
    const button = rendered.getByTestId('button_arrow');
    expect(button.props.accessibilityState.disabled).toBeFalsy();
  });
  it('should not clickable when cant reach internet', () => {
    useNetworkStore.setState((state:INetworkState) => {
      state.isInternetReachable = false;
      return state;
    });
    const rendered = renderWithRedux(<Icon icon="AngleRight" onPress={jest.fn()} buttonTestID="button_arrow" />);
    const button = rendered.getByTestId('button_arrow');
    expect(button.props.accessibilityState.disabled).toBeTruthy();
  });
});
