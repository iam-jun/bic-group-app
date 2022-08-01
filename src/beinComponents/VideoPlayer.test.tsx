import * as React from 'react';
import {cleanup, fireEvent} from '@testing-library/react-native';

import {renderWithRedux} from '~/test/testUtils';
import VideoPlayer from './VideoPlayer';
import { NOTIFICATIONS_RESPONSE } from '~/test/mock_data/notifications';

afterEach(cleanup);

describe('NotificationBottomSheet component', () => {

    const videoData = NOTIFICATIONS_RESPONSE.data.list[1].activities[0].media.videos[0];
  const postId =  NOTIFICATIONS_RESPONSE.data.list[1].activities[0].id ||'';
  it(`renders correctly`, () => {
    const rendered = renderWithRedux(
     <VideoPlayer data={videoData} postId={postId.toString()} />
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});