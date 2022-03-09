import {cleanup, render} from '@testing-library/react-native';
import React from 'react';
import NotificationContent from '.';
import {SAMPLE_ACTIVITY_1} from '../constants';

afterEach(cleanup);

describe('NotificationContent component', () => {
  const baseProps = {
    activities: [SAMPLE_ACTIVITY_1] as any,
  };

  it(`renders correctly`, async () => {
    const wrapper = render(<NotificationContent {...baseProps} />);
    const rendered = wrapper.toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it(`renders null`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 999,
    };
    const activities = [activity];
    const props = {
      activities: activities as any,
    };
    const wrapper = render(<NotificationContent {...props} />);
    const rendered = wrapper.toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it(`should show "NotificationContent" with title, no body`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 19,
    };
    const activities = [activity];
    const props = {
      activities: activities as any,
    };
    const wrapper = render(<NotificationContent {...props} />);
    const title = wrapper.getByTestId('notification_content.title');
    const body = wrapper.queryByTestId('notification_content.body');

    expect(title).not.toBeNull();
    expect(body).toBeNull();
  });

  it(`should show "NotificationContent" without title`, async () => {
    const activity = {
      ...SAMPLE_ACTIVITY_1,
      notification_type: 7,
      reaction: {
        data: {
          content: 'test',
        },
      },
    };
    const activities = [activity];
    const props = {
      activities: activities as any,
    };
    const wrapper = render(<NotificationContent {...props} />);
    const component = wrapper.getByTestId('notification_content.body');

    expect(component).not.toBeNull();
    expect(component.props.children).toBe('test');
  });
});
