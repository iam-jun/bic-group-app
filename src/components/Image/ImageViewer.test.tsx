import React from 'react';
import { act, fireEvent, renderWithRedux } from '~/test/testUtils';
import ImagePreviewer from './ImageViewer';

describe('ImageViewer', () => {
  it('given an array source should render correctly', () => {
    const onLongPress = jest.fn();
    const rendered = renderWithRedux(
      <ImagePreviewer
        source={['https://img.com/1']}
        initIndex={0}
        onLongPress={onLongPress}
        testID="image_previewer.img"
      />,
    );

    const img = rendered.getByTestId('image_previewer.img');
    expect(img).toBeDefined();
  });

  it('given an object source should render correctly', () => {
    const onLongPress = jest.fn();
    const rendered = renderWithRedux(
      <ImagePreviewer
        source="https://img.com/1"
        onLongPress={onLongPress}
        testID="image_previewer.img"
      />,
    );

    const img = rendered.getByTestId('image_previewer.img');
    expect(img).toBeDefined();
  });

  it('given an image should long pressable', () => {
    const onLongPress = jest.fn();
    const rendered = renderWithRedux(
      <ImagePreviewer
        source={['https://img.com/1']}
        initIndex={0}
        onLongPress={onLongPress}
        testID="image_previewer.img"
      />,
    );

    const touchableImg = rendered.getByTestId('image_previewer.touchable_img');
    expect(touchableImg).toBeDefined();

    fireEvent(touchableImg, 'onLongPress');

    expect(onLongPress).toBeCalled();
  });

  it('given an image should show gallery when pressing on image', () => {
    const onLongPress = jest.fn();

    const rendered = renderWithRedux(
      <ImagePreviewer
        source={[{ uri: 'https://img.com/1', name: 'abc' }]}
        onLongPress={onLongPress}
        testID="image_previewer.img"
      />,
    );

    const touchableImg = rendered.getByTestId('image_previewer.touchable_img');
    expect(touchableImg).toBeDefined();

    act(() => {
      fireEvent(touchableImg, 'onPress');
    });

    const imgGalleryModal = rendered.getByTestId('image_gallery_modal');
    expect(imgGalleryModal).toBeDefined();
  });
});
