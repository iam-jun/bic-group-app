import React from 'react';
import useNetworkStore, { INetworkState } from '~/store/network';

import TabButton from './TabButton';
import { renderWithRedux } from '~/test/testUtils';

describe('TabButton', () => {
  it('renders selected button with size medium', () => {
    const rendered = renderWithRedux(
      <TabButton testID="hometab" isSelected size="medium">Tab button</TabButton>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders unselected button with size large', () => {
    const rendered = renderWithRedux(
      <TabButton testID="hometab" isSelected={false} size="large">Tab button</TabButton>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should disable button when cant connect to internet', () => {
    useNetworkStore.setState((state:INetworkState) => {
      state.isInternetReachable = false;
      return state;
    });

    const rendered = renderWithRedux(
      <TabButton testID="hometab" isSelected size="large">Tab button</TabButton>,
    );
    const button = rendered.getByTestId('hometab-selected');
    expect(button.props.accessibilityState.disabled).toBeTruthy();
  });
});
