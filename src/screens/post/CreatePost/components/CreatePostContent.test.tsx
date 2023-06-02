import React from 'react';

import {
  act,
  fireEvent,
  renderHook,
  renderWithRedux,
  waitFor,
} from '~/test/testUtils';
import CreatePostContent from '~/screens/post/CreatePost/components/CreatePostContent';
import useCreatePostStore from '../store';
import streamApi from '~/api/StreamApi';
import useCreatePost from '../hooks/useCreatePost';
import * as Helper from '~/screens/post/CreatePost/helper';
import { mockEditPost, mockMediaFiles, mockMediaVideos } from '~/test/mock_data/post';
import groupApi from '~/api/GroupApi';
import AlertModal from '~/beinComponents/modals/AlertModal';
import { uploadApiConfig } from '~/api/UploadApi';
import useUploaderStore from '~/store/uploader';

const FakeCreatePost = ({ postId }: any) => {
  const useCreatePostData = useCreatePost({
    screenParams: {
      postId,
    },
  });
  return (
    <>
      <CreatePostContent groupIds={[]} useCreatePostData={useCreatePostData} />
      <AlertModal />
    </>
  );
};

describe('CreatePostContent component', () => {
  it('given on change text action should save the text', async () => {
    const post = {
      data: mockEditPost,
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);

    jest.spyOn(Helper, 'isAndroidAnimated').mockReturnValue(true);

    const { result: resultCreatePost } = renderHook(() => useCreatePost({
      screenParams: { postId: mockEditPost.id },
    }));
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    const wrapper = renderWithRedux(
      <CreatePostContent
        groupIds={[]}
        useCreatePostData={resultCreatePost.current}
      />,
    );

    const textInput = wrapper.getByTestId('_mention_input.input');

    act(() => {
      fireEvent.changeText(textInput, 'abc');
    });

    expect(resultCreatePostStore.current.createPost.content).toBe('abc');
  });

  it('given content contains link should render with link preview', async () => {
    const post = {
      data: {
        ...mockEditPost,
        content: 'abc https://vnexpress.net',
      },
    };
    const linkPreview = {
      data: {
        title: 'vnexpress',
        domain: 'https://vnexpress.net',
        image: 'https://thumbnail.com/123',
        description: 'Site desc',
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    jest
      .spyOn(groupApi, 'getLinkPreview')
      .mockImplementation(() => Promise.resolve(linkPreview) as any);
    jest.spyOn(Helper, 'isAndroidAnimated').mockReturnValue(true);

    const wrapper = renderWithRedux(
      <FakeCreatePost postId={mockEditPost.id} />,
    );

    await waitFor(() => {
      const linkPreview = wrapper.getByTestId('link_preview');
      expect(linkPreview).toBeDefined();
    }, { timeout: 2000 });
  });

  it('given video with thumbnail should show video', async () => {
    const post = {
      data: {
        ...mockEditPost,
        media: {
          ...mockEditPost.media,
          videos: mockMediaVideos,
        },
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    jest.spyOn(Helper, 'isAndroidAnimated').mockReturnValue(true);

    const wrapper = renderWithRedux(
      <FakeCreatePost postId={mockEditPost.id} />,
    );

    await waitFor(() => {
      const videoPlayer = wrapper.getByTestId('video_player');
      expect(videoPlayer).toBeDefined();
    });
  });

  it('given video with thumbnail should closable', async () => {
    const post = {
      data: {
        ...mockEditPost,
        media: {
          ...mockEditPost.media,
          videos: mockMediaVideos,
        },
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    jest.spyOn(Helper, 'isAndroidAnimated').mockReturnValue(true);

    const wrapper = renderWithRedux(
      <FakeCreatePost postId={mockEditPost.id} />,
    );

    let btnCloseVideoPlayer = null;

    await waitFor(() => {
      btnCloseVideoPlayer = wrapper.getByTestId('post_video_player.close');
      expect(btnCloseVideoPlayer).toBeDefined();
    });

    act(() => {
      fireEvent.press(btnCloseVideoPlayer);
    });

    await waitFor(() => {
      expect(useCreatePostStore.getState().createPost.video).toBeUndefined();
    });
  });

  it('given video with no thumbnail should render UploadingFile', async () => {
    const post = {
      data: {
        ...mockEditPost,
        media: {
          ...mockEditPost.media,
          videos: [
            {
              ...mockMediaVideos[0],
              thumbnails: [],
            },
          ],
        },
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    jest.spyOn(Helper, 'isAndroidAnimated').mockReturnValue(true);

    const wrapper = renderWithRedux(
      <FakeCreatePost postId={mockEditPost.id} />,
    );

    await waitFor(() => {
      const uploadingFile = wrapper.getByTestId('uploading_file');
      expect(uploadingFile).toBeDefined();
    });
  });

  it('given files should removable', async () => {
    const post = {
      data: {
        ...mockEditPost,
        media: {
          ...mockEditPost.media,
          files: mockMediaFiles,
        },
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    jest.spyOn(Helper, 'isAndroidAnimated').mockReturnValue(true);

    const wrapper = renderWithRedux(
      <FakeCreatePost postId={mockEditPost.id} />,
    );

    let btnCloseFile = null;

    await waitFor(() => {
      btnCloseFile = wrapper.getByTestId('uploading_file.btn_close');
      expect(btnCloseFile).toBeDefined();
    });

    act(() => {
      fireEvent.press(btnCloseFile);
    });

    let alertModalConfirmBtn = null;

    await waitFor(() => {
      alertModalConfirmBtn = wrapper.getByTestId('alert_modal.confirm');
      expect(alertModalConfirmBtn).toBeDefined();
    });

    act(() => {
      fireEvent.press(alertModalConfirmBtn);
    });

    await waitFor(() => {
      expect(useCreatePostStore.getState().createPost.files.length).toBe(0);
    });
  });

  it('given a file upload should show error if uploading is failed', async () => {
    const post = {
      data: {
        ...mockEditPost,
        media: {
          ...mockEditPost.media,
          files: [
            {
              name: 'abc.zip',

            },
          ],
        },
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    jest.spyOn(uploadApiConfig, 'createFileId')
      .mockImplementation(() => Promise.reject() as any);
    jest.spyOn(Helper, 'isAndroidAnimated').mockReturnValue(true);

    renderWithRedux(
      <FakeCreatePost postId={mockEditPost.id} />,
    );

    await waitFor(() => {
      expect(useUploaderStore.getState().errors['abc.zip']).toBeDefined();
    });
  });

  it('paste an image should show error if uploading is failed', async () => {
    const post = {
      data: {
        ...mockEditPost,
      },
    };
    const imgs = [
      {
        fileName: 'abc.png',
        type: 'image',
        fileSize: 1024,
        uri: 'file:///abc/xyz',
      },
    ];
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    jest.spyOn(Helper, 'isAndroidAnimated').mockReturnValue(true);

    const wrapper = renderWithRedux(
      <FakeCreatePost postId={mockEditPost.id} />,
    );

    const input = wrapper.getByTestId('_mention_input.input');

    act(() => {
      input.props.onPaste('', imgs);
    });

    await waitFor(() => {
      expect(useCreatePostStore.getState().createPost.images.length).toBe(1);
    });
  });
});
