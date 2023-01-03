import * as React from 'react';
import CommentToolbar from '.';
import { fireEvent, renderWithRedux, cleanup } from '~/test/testUtils';

afterEach(cleanup);

describe('CommentToolbar component', () => {
  it('renders correctly', () => {
    const onSelectImage = jest.fn();
    const onSelectGif = jest.fn();
    const onSelectEmoij = jest.fn();
    const rendered = renderWithRedux(
      <CommentToolbar
        onSelectImage={onSelectImage}
        onSelectGif={onSelectGif}
        onSelectEmoij={onSelectEmoij}
      />,
    );
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly null', () => {
    const rendered = renderWithRedux(<CommentToolbar />);
    expect(rendered).toMatchSnapshot();
  });

  it('should call prop onSelectImage', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithRedux(
      <CommentToolbar onSelectImage={onSelect} />,
    );
    const btn = getByTestId('comment_toolbar.btn_image');
    expect(btn).toBeDefined();
    fireEvent.press(btn);
    expect(onSelect).toBeCalled();
  });

  it('should call prop onSelectGif', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithRedux(
      <CommentToolbar onSelectGif={onSelect} />,
    );
    const btn = getByTestId('comment_toolbar.btn_gif');
    expect(btn).toBeDefined();
    fireEvent.press(btn);
    expect(onSelect).toBeCalled();
  });

  it('should call prop onSelectEmoij', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithRedux(
      <CommentToolbar onSelectEmoij={onSelect} />,
    );
    const btn = getByTestId('comment_toolbar.btn_icon');
    expect(btn).toBeDefined();
    fireEvent.press(btn);
    expect(onSelect).toBeCalled();
  });
});
