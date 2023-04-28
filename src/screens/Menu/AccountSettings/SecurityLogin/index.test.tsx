import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SecurityLogin from './index';
import * as navigationHook from '~/hooks/navigation';

describe('SecurityLogin component', () => {
  it('renders correctly', async () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const rendered = renderWithRedux(<SecurityLogin />);
    const { getByTestId } = rendered;
    const component = getByTestId('SecurityLogin');
    expect(component).toBeDefined();

    const btn = getByTestId('list_view.item_wrapper.0');
    fireEvent.press(btn);
    expect(navigate).toBeCalled();
  });
});
