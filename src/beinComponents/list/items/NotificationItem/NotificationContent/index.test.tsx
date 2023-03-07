import { cleanup } from '@testing-library/react-native';
import React from 'react';
import {
  mockNotifications,
} from '~/test/mock_data/notifications';
import { renderWithRedux } from '~/test/testUtils';
import NotificationContent from '.';

afterEach(cleanup);

describe('NotificationContent component', () => {
  it('renders correctly', async () => {
    const updatedAt = mockNotifications[0].updated_at;
    const { extra } = mockNotifications[0];
    const wrapper = renderWithRedux(
      <NotificationContent
        description={extra.description}
        content={extra.content}
        updatedAt={updatedAt}
      />,
    );

    const textDescriptionComponent = wrapper.getByTestId('notification_content.description');
    expect(textDescriptionComponent).toBeDefined();

    const contentComponent = wrapper.getByTestId('notification_content.content');
    expect(contentComponent).toBeDefined();
    expect(contentComponent.props?.children).toEqual(extra.content);

    const timeComponent = wrapper.getByTestId('notification_content.time_view');
    expect(timeComponent).toBeDefined();
  });
});
