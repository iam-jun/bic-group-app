import { cleanup } from '@testing-library/react-native';
import React from 'react';
import initialState from '~/storeRedux/initialState';
import { USER_PROFILE } from '~/test/mock_data/menu';

import {
  configureStore, renderWithRedux,
} from '~/test/testUtils';
import AvatarImage from '.';

afterEach(cleanup);

describe('AvatarImage screen', () => {
  const baseProps = {
    userId: '1',
    currentUsername: 'username',
    avatar: null,
    coverHeight: 120,
    onEdit: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = { ...initialState };
    storeData.menu.myProfile = {} as any;
    storeData.auth.user = {} as any;
    storeData.menu.showUserNotFound = false;
    storeData.menu.loadingUserProfile = false;
  });

  const mockStore = configureStore([]);
  let storeData: any;

  it('renders correctly', () => {
    storeData.menu.myProfile = USER_PROFILE;

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AvatarImage {...baseProps} />, store);
    expect(wrapper).toMatchSnapshot();
  })
});
