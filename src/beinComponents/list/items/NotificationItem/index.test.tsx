import {cleanup, render} from '@testing-library/react-native';
import React from 'react';
import NotificationItem from '.';
import {SAMPLE_ACTIVITY_1} from './constants';

afterEach(cleanup);

describe('NotificationItem component', () => {
  const now = new Date();
  const threeWeekAgo = new Date(now.setDate(now.getDate() - 20)).toISOString();
  const baseProps = {
    activities: [SAMPLE_ACTIVITY_1],
    actor: {
      id: 2,
      username: 'trannamanh',
      fullname: 'Trần Nam Anh',
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
    },
    activity_count: 1,
    actor_count: 1,
    createdAt: threeWeekAgo,
    description: '**Trần Nam Anh** created a post in **EVOL Community**',
    group: '8fa9e1c0-c098-11ec-8080-80017d3c69d6',
    id: '8fac1916-c098-11ec-8080-800147ae0f0a.8fa9e1c0-c098-11ec-8080-80017d3c69d6',
    isRead: false,
    is_seen: true,
    verb: 'post',
  };

  let Platform: any;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  it(`renders correctly`, async () => {
    const wrapper = render(<NotificationItem {...baseProps} />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show "NotificationItem" without indicator`, async () => {
    Platform.OS = 'ios';

    const props = {
      ...baseProps,
      isRead: true,
    };
    const wrapper = render(<NotificationItem {...props} />);
    const component = wrapper.queryByTestId('notification_item.indicator');
    const componentWeb = wrapper.queryByTestId(
      'notification_item.indicator.web',
    );
    expect(component).toBeNull();
    expect(componentWeb).toBeNull();
  });

  it(`should show "NotificationItem" with indicator`, async () => {
    Platform.OS = 'ios';

    const wrapper = render(<NotificationItem {...baseProps} />);
    const component = wrapper.getByTestId('notification_item.indicator');

    expect(component).not.toBeNull();
  });

  it(`should show "NotificationItem" with indicator web style`, async () => {
    Platform.OS = 'web';
    const props = {
      ...baseProps,
      isActive: true,
    };
    const wrapper = render(<NotificationItem {...props} />);
    const component = wrapper.getByTestId('notification_item.indicator.web');

    expect(component).not.toBeNull();
  });

  it(`should show "NotificationItem" with time view`, async () => {
    const wrapper = render(<NotificationItem {...baseProps} />);
    const component = wrapper.getByTestId('notification_item.time_view');

    expect(component).not.toBeNull();
  });
});
