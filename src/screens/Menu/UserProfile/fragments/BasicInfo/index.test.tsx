import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import BasicInfo from '.';
import * as navigationHook from '~/hooks/navigation';

describe('BasicInfo component', () => {
  const baseProps = {
    birthday: null,
    fullname: 'Test',
    gender: null,
    isCurrentUser: true,
    language: [],
    relationship: null,
  };

  it('renders correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(<BasicInfo {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('user_profile.basic_info');
    expect(containerComponent).toBeDefined();

    const editBtn = getByTestId('basic_info.edit_btn');
    fireEvent.press(editBtn);
    expect(navigate).toBeCalled();
  });
});
