import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import MenuHeader from './MenuHeader';
import * as navigationHook from '~/hooks/navigation';

describe('MenuHeader component', () => {
  it('renders correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(<MenuHeader />);
    const { getByTestId } = rendered;
    const component = getByTestId('menu_header');
    expect(component).toBeDefined();

    const btn = getByTestId('menu_header.fullname_btn');
    fireEvent.press(btn);
    expect(navigate).toBeCalled();
  });
});
