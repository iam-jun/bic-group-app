import React from 'react';

import {
  act, fireEvent, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import useCreatePostStore from '../store';
import { mockMediaImages } from '~/test/mock_data/post';
import PostSelectImage from './PostSelectImage';
import uploadApi from '~/api/UploadApi';
import useUploaderStore from '~/store/uploader';

describe('PostSelectImage component', () => {
  it('given an image should removable', async () => {
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.updateCreatePost({
        images: mockMediaImages,
      });
    });

    const wrapper = renderWithRedux(<PostSelectImage />);

    const btnCloseImage = wrapper.getByTestId('upload_image.button_close');

    act(() => {
      fireEvent.press(btnCloseImage);
    });

    expect(resultCreatePostStore.current.createPost.images.length).toBe(0);
  });

  it('given a local image should upload success', async () => {
    const createIdResponse = {
      data: {
        data: {
          id: '',
        },
      },
    };
    const uploadResponse = {
      data: {
        data: {
          id: '',
          url: 'https://img.com/123',
        },
      },
    };
    jest
      .spyOn(uploadApi, 'createFileId')
      .mockImplementation(() => Promise.resolve(createIdResponse) as any);
    jest
      .spyOn(uploadApi, 'uploadImageToS3')
      .mockImplementation(() => Promise.resolve(uploadResponse) as any);

    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.updateCreatePost({
        images: [
          {
            fileName: 'abc.png',
            file: {
              size: 1024,
              name: 'abc.png',
            },
          },
        ],
      });
    });

    renderWithRedux(<PostSelectImage />);

    await waitFor(() => {
      expect(useUploaderStore.getState().uploadedFiles['abc.png']).toBeDefined();
    });

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.images[0].uploading).toBe(false);
    });
  });
});
