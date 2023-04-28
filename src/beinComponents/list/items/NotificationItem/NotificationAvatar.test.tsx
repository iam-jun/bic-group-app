/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup } from '@testing-library/react-native';
import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import NotificationAvatar from './NotificationAvatar';
import { mockNotifications } from '~/test/mock_data/notifications';

afterEach(cleanup);

describe('NotificationAvatar component', () => {
  it('should render null when actors is empty', () => {
    const wrapper = renderWithRedux(
      <NotificationAvatar
        actors={[]}
        actorCount={0}
      />,
    );

    const avatarComponent = wrapper.queryByTestId('notification.avatars');
    expect(avatarComponent).toBeNull();
  });

  it('renders correctly with COMMENT verb with action comment lv1', () => {
    const { actors } = mockNotifications[0].extra;
    const actorCount = mockNotifications[0].actor_count;

    const wrapper = renderWithRedux(
      <NotificationAvatar
        actors={actors}
        actorCount={actorCount}
      />,
    );
    const avatarComponent = wrapper.queryByTestId('notification.avatars');
    expect(avatarComponent).toBeDefined();
  });
});
