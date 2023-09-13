import React from 'react';
import { fireEvent, render } from '~/test/testUtils';
import PostPhotoPreview from './index';
import { ResourceUploadType } from '~/interfaces/IUpload';

describe('PostPhotoPreview component', () => {
  const data = [
    {
      id: '1',
      url: 'https://img.xyz/1',
      width: 90,
      height: 100,
    },
    {
      id: '2',
      url: 'https://img.xyz/2',
      width: 90,
      height: 100,
    },
    {
      id: '3',
      url: 'https://img.xyz/3',
      width: 90,
      height: 100,
    },
    {
      id: '4',
      url: 'https://img.xyz/4',
      width: 90,
      height: 100,
    },
    {
      id: '5',
      url: 'https://img.xyz/5',
      width: 90,
      height: 100,
    },
  ];
  it('given no data should return null', () => {
    const wrapper = render(
      <PostPhotoPreview data={[]} uploadType={ResourceUploadType.postContent} />,
    );
    expect(wrapper.toJSON()).toBe(null);
  });

  it('should press on image', () => {
    const onPress = jest.fn();

    const wrapper = render(
      <PostPhotoPreview
        data={data as any}
        uploadType={ResourceUploadType.postContent}
        onPress={onPress}
      />,
    );

    const firstImage = wrapper.getByTestId('post_photo_preview.first_image');
    fireEvent.press(firstImage);

    expect(onPress).toBeCalled();
  });

  it('should long press on image', () => {
    const onLongPress = jest.fn();

    const wrapper = render(
      <PostPhotoPreview
        data={data as any}
        uploadType={ResourceUploadType.postContent}
        onLongPress={onLongPress}
      />,
    );

    const firstImage = wrapper.getByTestId('post_photo_preview.first_image');
    fireEvent(firstImage, 'onLongPress');

    expect(onLongPress).toBeCalled();
  });

  it('should mark seen post when pressing on image', () => {
    const onPressMarkSeenPost = jest.fn();

    const wrapper = render(
      <PostPhotoPreview
        data={data as any}
        uploadType={ResourceUploadType.postContent}
        onPressMarkSeenPost={onPressMarkSeenPost}
        enableGalleryModal
      />,
    );

    const firstImage = wrapper.getByTestId('post_photo_preview.first_image');
    fireEvent(firstImage, 'onPress');

    expect(onPressMarkSeenPost).toBeCalled();
  });
});
