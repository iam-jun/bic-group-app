import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import NoUserFound from './NoUserFound';
import * as navigationHook from '~/hooks/navigation';

describe('NoUserFound component', () => {
  it('renders correctly', () => {
    const goBack = jest.fn();
    const rootNavigation = { goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(<NoUserFound />);
    const { getByTestId } = rendered;
    const component = getByTestId('no_user_found');
    expect(component).toBeDefined();

    const btn = getByTestId('no_user_found.go_back_btn');
    fireEvent.press(btn);
    expect(goBack).toBeCalled();
  });
});
