import React from 'react';
import { postImage, postImageVerticle } from '~/test/mock_data/pinContent';
import { renderWithRedux } from '~/test/testUtils';
import PinPostImage from './PinPostImage';
import { ResourceUploadType } from '~/interfaces/IUpload';

describe('PinPostImage component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <PinPostImage
        data={postImage.media.images as any}
        uploadType={ResourceUploadType.postContent}
      />,
    );
    const image = rendered.queryByTestId('upload_image');
    expect(image).toBeDefined();
  });

  it('renders verticle image', () => {
    const rendered = renderWithRedux(
      <PinPostImage
        data={postImageVerticle.media.images as any}
        uploadType={ResourceUploadType.postContent}
      />,
    );
    const blurImage = rendered.queryByTestId('pin_post_image.blur_image');
    expect(blurImage).toBeDefined();
  });

  it('render null when data empty', () => {
    const rendered = renderWithRedux(
      <PinPostImage
        data={[] as any}
        uploadType={ResourceUploadType.postContent}
      />,
    );
    const blurImage = rendered.queryByTestId('pin_post_image.blur_image');
    const image = rendered.queryByTestId('upload_image');
    expect(blurImage).toBeNull();
    expect(image).toBeNull();
  });
});
