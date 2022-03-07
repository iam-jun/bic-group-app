import {cleanup, render} from '@testing-library/react-native';
import React from 'react';
import NotificationAvatar from './NotificationAvatar';
import {SAMPLE_ACTIVITY_1, SAMPLE_ACTIVITY_2} from './constants';

afterEach(cleanup);

describe('NotificationAvatar component', () => {
  const baseProps = {
    activities: [SAMPLE_ACTIVITY_1] as any,
  };

  it(`renders correctly`, async () => {
    const wrapper = render(<NotificationAvatar {...baseProps} />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show "NotificationAvatar" without group`, async () => {
    const props = {
      activities: [SAMPLE_ACTIVITY_1, SAMPLE_ACTIVITY_2] as any,
    };
    const wrapper = render(<NotificationAvatar {...props} />);
    const component = wrapper.queryByTestId('notification_avatar.group');

    expect(component).toBeNull();
  });

  it(`should show "NotificationAvatar" without single`, async () => {
    const props = {
      activities: [SAMPLE_ACTIVITY_1] as any,
    };
    const wrapper = render(<NotificationAvatar {...props} />);
    const component = wrapper.queryByTestId('notification_avatar.single');

    expect(component).toBeNull();
  });

  it(`renders multiple avatars`, async () => {
    const props = {
      activities: [
        SAMPLE_ACTIVITY_1,
        SAMPLE_ACTIVITY_2,
        SAMPLE_ACTIVITY_1,
        SAMPLE_ACTIVITY_2,
      ] as any,
    };
    const wrapper = render(<NotificationAvatar {...props} />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
