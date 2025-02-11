import React from 'react';
import useBlockingStore from '~/store/blocking';
import { responseGetListBlockingUsers } from '~/test/mock_data/blocking';

import { renderWithRedux } from '~/test/testUtils';
import Blocking from './index';
import MockedNavigator from '~/test/MockedNavigator';

describe('Blocking component', () => {
  const props = { route: { params: {} } };
  it('renders correctly - have data', () => {
    useBlockingStore.setState((state) => {
      state.list = responseGetListBlockingUsers.data;
      return state;
    });

    const rendered = renderWithRedux(
      <MockedNavigator component={() => <Blocking {...props} />} />,
    );
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('blocking');
    expect(containerComponent).toBeDefined();
  });

  it('renders correctly - no data', () => {
    const rendered = renderWithRedux(
      <MockedNavigator component={() => <Blocking {...props} />} />,
    );
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('blocking');
    expect(containerComponent).toBeDefined();
  });
});
