import * as React from 'react';
import CommentToolbar from './CommentToolbar';
import { fireEvent, renderWithRedux, cleanup } from '~/test/testUtils';

afterEach(cleanup);

describe('CommentToolbar component', () => {
  it('renders correctly', () => {
    const onSelectImage = jest.fn();
    const onSelectFile = jest.fn();
    const onSelectGif = jest.fn();
    const onSelectVideo = jest.fn();
    const rendered = renderWithRedux(
      <CommentToolbar
        onSelectImage={onSelectImage}
        onSelectFile={onSelectFile}
        onSelectGif={onSelectGif}
        onSelectVideo={onSelectVideo}
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

  it('should call prop onSelectFile', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithRedux(
      <CommentToolbar onSelectFile={onSelect} />,
    );
    const btn = getByTestId('comment_toolbar.btn_file');
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

  it('should call prop onSelectVideo', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithRedux(
      <CommentToolbar onSelectVideo={onSelect} />,
    );
    const btn = getByTestId('comment_toolbar.btn_video');
    expect(btn).toBeDefined();
    fireEvent.press(btn);
    expect(onSelect).toBeCalled();
  });
});
