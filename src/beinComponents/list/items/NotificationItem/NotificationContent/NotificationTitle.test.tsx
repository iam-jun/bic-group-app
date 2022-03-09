import {cleanup, render} from '@testing-library/react-native';
import React from 'react';
import NotificationTitle from './NotificationTitle';

afterEach(cleanup);

describe('NotificationTitle component', () => {
  const baseProps = {
    actorNames: 'Trần Nam Anh',
    verbText: 'commented on your post',
  };

  it(`renders correctly`, async () => {
    const wrapper = render(<NotificationTitle {...baseProps} />);
    const rendered = wrapper.toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it(`should show "NotificationTitle" with groupText`, async () => {
    const props = {
      ...baseProps,
      groupText: 'EVOL Community',
    };
    const wrapper = render(<NotificationTitle {...props} />);
    const component = wrapper.getByTestId('notification_title.group_text');

    expect(component).not.toBeNull();
  });

  it(`should show "NotificationTitle" with emoji`, async () => {
    const props = {
      ...baseProps,
      verbText: {
        emoji: '😄',
        targetText: 'to your post',
      },
    };
    const wrapper = render(<NotificationTitle {...props} />);
    const rendered = wrapper.toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
