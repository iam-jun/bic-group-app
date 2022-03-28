import {cleanup, render} from '@testing-library/react-native';
import React from 'react';
import NotificationItem from '.';
import {SAMPLE_ACTIVITY_1} from './constants';

afterEach(cleanup);

describe('NotificationItem component', () => {
  const now = new Date();
  const threeWeekAgo = new Date(now.setDate(now.getDate() - 20)).toISOString();
  const baseProps = {
    activities: [SAMPLE_ACTIVITY_1] as any,
    is_read: false,
    is_seen: false,
    isActive: false,
    verb: 'verb',
    actor_count: 1,
    activity_count: 1,
    created_at: threeWeekAgo,
    updated_at: threeWeekAgo,
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
      is_read: true,
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
