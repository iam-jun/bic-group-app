import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import HeaderCreatePost from './HeaderCreatePost';
import { audiencesTree } from '~/test/mock_data/audiences';
import * as navigationHook from '~/hooks/navigation';
import useAuthController from '~/screens/auth/store';

describe('HeaderCreatePost component', () => {
  const props = {
    audience: audiencesTree,
    createFromGroupId: 'test',
  };
  it('renders correctly', () => {
    useAuthController.setState((state) => {
      state.authUser = { userId: 'test' };
      return state;
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<HeaderCreatePost {...props} />);
    const { getByTestId } = rendered;
    const btnCreate = getByTestId('header_create_post');
    expect(btnCreate).toBeDefined();
    fireEvent.press(btnCreate);
    expect(navigate).toBeCalled();
  });
});
