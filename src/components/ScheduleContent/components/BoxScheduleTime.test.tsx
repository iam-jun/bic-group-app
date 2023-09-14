import React from 'react';
import { PostStatus } from '~/interfaces/IPost';
import BoxScheduleTime from './BoxScheduleTime';
import colors from '~/theme/theme';
import { renderWithRedux } from '~/test/testUtils';

describe('BoxScheduleTime component', () => {
  const normalProps = {
    scheduledAt: '2023-03-13T05:30:00.982Z',
    status: PostStatus.WAITING_SCHEDULE,
  };

  const failProps = {
    scheduledAt: '2023-03-13T05:30:00.982Z',
    status: PostStatus.SCHEDULE_FAILED,
  };

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <BoxScheduleTime {...normalProps} />,
    );

    const containerView = rendered.queryByTestId('box_schedule_time');
    expect(containerView.props.style[1].backgroundColor).toEqual(
      colors.light.colors.blue2,
    );
  });

  it('renders schedule article fail with red background', () => {
    const rendered = renderWithRedux(
      <BoxScheduleTime {...failProps} />,
    );

    const containerView = rendered.queryByTestId('box_schedule_time');
    expect(containerView.props.style[1].backgroundColor).toEqual(
      colors.light.colors.red2,
    );
  });
});
