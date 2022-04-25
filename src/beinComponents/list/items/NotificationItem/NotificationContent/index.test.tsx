import {cleanup, render} from '@testing-library/react-native';
import React from 'react';
import NotificationContent from '.';
import {SAMPLE_ACTIVITY_1} from '../constants';

afterEach(cleanup);

describe('NotificationContent component', () => {
  const baseProps = {
    activities: [SAMPLE_ACTIVITY_1] as any,
    description: '**Trần Nam Anh** created a post in **EVOL Community**',
  };

  it(`renders correctly`, async () => {
    const wrapper = render(<NotificationContent {...baseProps} />);
    const rendered = wrapper.toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it(`should show "NotificationContent" with description, no content`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      content: null,
    };
    const activities = [activity];
    const props = {
      ...baseProps,
      activities: activities as any,
      description: 'Description',
    };
    const wrapper = render(<NotificationContent {...props} />);
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeNull();
  });

  it(`should show "NotificationContent" without content when there is no activity`, async () => {
    const activities: any[] = [];
    const props = {
      ...baseProps,
      activities: activities,
    };
    const wrapper = render(<NotificationContent {...props} />);
    const description = wrapper.getByTestId('notification_content.description');
    const content = wrapper.queryByTestId('notification_content.content');

    expect(description).not.toBeNull();
    expect(content).toBeNull();
  });
});
