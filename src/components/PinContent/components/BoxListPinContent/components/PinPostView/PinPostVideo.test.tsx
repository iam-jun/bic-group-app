import React from 'react';
import { postVideo, postVideoVerticle } from '~/test/mock_data/pinContent';
import { renderWithRedux } from '~/test/testUtils';
import PinPostVideo from './PinPostVideo';

describe('PinPostVideo component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <PinPostVideo
        data={postVideo.media.videos[0] as any}
      />,
    );
    const video = rendered.queryByTestId('pin_post_video.content');
    expect(video).toBeDefined();
  });

  it('renders verticle video', () => {
    const rendered = renderWithRedux(
      <PinPostVideo
        data={postVideoVerticle.media.videos[0] as any}
      />,
    );
    const blurVideo = rendered.queryByTestId('pin_post_video.blur_video');
    expect(blurVideo).toBeDefined();
  });

  it('should render null', () => {
    const rendered = renderWithRedux(
      <PinPostVideo
        data={{} as any}
      />,
    );
    const video = rendered.queryByTestId('pin_post_video.content');
    expect(video).toBeNull();
  });
});
