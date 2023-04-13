import useModalStore from '~/store/modal';
import useUploaderStore from '~/store/uploader';
import { act, waitFor } from '~/test/testUtils';
import { handleBack } from './handler';

describe('handler create post', () => {
  describe('handleBack function', () => {
    it('given isEditPost = true & isEditPostHasChange = true should show alert', async () => {
      handleBack({ isEditPost: true, isEditPostHasChange: true } as any);

      await waitFor(() => {
        expect(useModalStore.getState().alert.content).toBeDefined();
      });
    });

    it('given hasPostId = true & hasUploadingProcess = true should show alert', async () => {
      act(() => {
        useUploaderStore.setState((state) => ({
          ...state,
          uploadingFiles: {
            'abc.zip': {} as any,
          },
        }));
      });
      handleBack({ hasPostId: true } as any);

      await waitFor(() => {
        expect(useModalStore.getState().alert.content).toBeDefined();
      });
    });

    it('given hasPostId = true & hasUploadingProcess = false should show alert saved', async () => {
      handleBack({ hasPostId: true } as any);

      await waitFor(() => {
        expect(useModalStore.getState().toast.content).toBeDefined();
      });
    });
  });
});
