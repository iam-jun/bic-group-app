import i18next from 'i18next';
import appConfig from '~/configs/appConfig';
import useModalStore from '~/store/modal';
import { mockMediaImages } from '~/test/mock_data/post';
import { act, renderHook, waitFor } from '~/test/testUtils';
import useCreatePostStore from '../store';
import useUploadImage from './useUploadImage';

describe('useUploadImage hook', () => {
  it('given over maximum images should show error and slice images', async () => {
    const { result: resultUploadImage } = renderHook(() => useUploadImage());
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.updateCreatePost({
        images: [
          ...mockMediaImages,
          ...mockMediaImages,
          ...mockMediaImages,
          ...mockMediaImages,
          ...mockMediaImages,
          ...mockMediaImages,
          ...mockMediaImages,
          ...mockMediaImages,
          ...mockMediaImages,
          ...mockMediaImages,
        ],
      });
    });

    act(() => {
      resultUploadImage.current.handleImage([{
        name: 'abc', filename: 'abc.png', type: 'image', size: 1024, uri: 'file:///abc.png',
      }]);
    });

    await waitFor(() => {
      expect(useModalStore.getState().toast?.content).toBe(i18next.t('post:error_reach_upload_photo_limit').replace(
        '%LIMIT%', `${appConfig.postPhotoLimit}`,
      ));
      expect(resultCreatePostStore.current.createPost.images.length).toBe(10);
    });
  });
});
