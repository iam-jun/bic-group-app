import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import Contact from '.';
import * as navigationHook from '~/hooks/navigation';

describe('Contact component', () => {
  const baseProps = {
    email: 'test',
    phone: 'test',
    countryCode: 'test',
    city: 'test',
    isCurrentUser: true,
  };

  it('renders correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(<Contact {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('user_profile.contact');
    expect(containerComponent).toBeDefined();

    const editBtn = getByTestId('contact.edit_btn');
    fireEvent.press(editBtn);
    expect(navigate).toBeCalled();
  });
});
