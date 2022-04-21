import {cleanup, render} from '@testing-library/react-native';
import React from 'react';
import NotificationAvatar from './NotificationAvatar';

afterEach(cleanup);

describe('NotificationAvatar component', () => {
  const baseProps = {
    // activities: [SAMPLE_ACTIVITY_1] as any,
    actor: {
      id: 2,
      username: 'trannamanh',
      fullname: 'Trần Nam Anh',
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
    },
  };

  it(`renders correctly`, async () => {
    const wrapper = render(<NotificationAvatar {...baseProps} />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
