/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import UserProfile from './index';
import useUserProfileStore, { IUserProfileState } from './store';

describe('UserProfile screen', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(<UserProfile />);

    const { getByTestId } = rendered;
    const containerComponent = getByTestId('UserProfile');
    expect(containerComponent).toBeDefined();
  });

  it('should render no user', () => {
    useUserProfileStore.setState((state: IUserProfileState) => {
      state.error = 'error';
      return state;
    });
    const rendered = renderWithRedux(<UserProfile />);

    const { getByTestId } = rendered;
    const containerComponent = getByTestId('no_user_found');
    expect(containerComponent).toBeDefined();
  });
});
