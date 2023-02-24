import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import AppVersion from './AppVersion';
import * as navigationHook from '~/hooks/navigation';

describe('AppVersion component', () => {
  it('renders correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(<AppVersion />);
    const { getByTestId } = rendered;
    const btn = getByTestId('app_version');
    expect(btn).toBeDefined();
    fireEvent.press(btn);
    expect(navigate).toBeCalled();
  });
});
