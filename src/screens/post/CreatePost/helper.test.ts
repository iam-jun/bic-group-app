import i18next from 'i18next';
import { isEqual } from 'lodash';
import appConfig from '~/configs/appConfig';
import useModalStore from '~/store/modal';
import useUploaderStore from '~/store/uploader';
import { act, renderHook, waitFor } from '~/test/testUtils';
import {
  getParamsValidateSeriesTags,
  isEqualById,
  validateFilesPicker,
  validateVideo,
} from './helper';
import useCreatePostStore from './store';

describe('helper create post', () => {
  describe('getParamsValidateSeriesTags function', () => {
    it('given selectedAudiences should return object validate series tags', async () => {
      const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

      act(() => {
        resultCreatePostStore.current.actions.updateCreatePost({
          series: [
            {
              id: '1',
            },
          ],
          tags: [
            {
              id: '2',
            },
          ],
        });
      });

      const selectedAudiences = [{ id: '3' }, { id: '4' }];
      const expectedResult = {
        groups: ['3', '4'],
        series: ['1'],
        tags: ['2'],
      };

      expect(
        JSON.stringify(getParamsValidateSeriesTags(selectedAudiences)),
      ).toBe(JSON.stringify(expectedResult));
    });
  });

  describe('isEqualById function', () => {
    it('given two different length arrays should return false', () => {
      expect(
        isEqualById([{ id: '1' }], [{ id: '1' }, { id: '2' }]),
      ).toBeFalsy();
    });

    it('given two arrays and has item not equal the same id should return false', () => {
      expect(isEqualById([{ id: '1' }], [{ id: '2' }])).toBeFalsy();
    });

    it('given two arrays and all items are equal the same id should return true', () => {
      expect(isEqualById([{ id: '1' }], [{ id: '1' }])).toBeTruthy();
    });

    it('given two objects with the same id should return true', () => {
      expect(isEqualById({ id: '1' }, { id: '1' })).toBeTruthy();
    });

    it('given two objects with not the same id should return false', () => {
      expect(isEqualById({ id: '1' }, { id: '2' })).toBeFalsy();
    });
  });

  describe('validateFilesPicker function', () => {
    it('given files over total size should show toast', async () => {
      const files: any = [
        {
          size: 1234567899999,
        },
      ];
      const totalFiles = 0;
      const totalSize = 0;

      validateFilesPicker(files, totalFiles, totalSize);

      await waitFor(() => {
        expect(useModalStore.getState().toast.content).toBe(
          i18next.t('upload:text_file_over_size'),
        );
      });
    });

    it('given files over maximum allowed should show toast', async () => {
      const files: any = [
        {
          size: 123,
        },
        {
          size: 123,
        },
      ];
      const totalFiles = 24;
      const totalSize = 0;

      const result = validateFilesPicker(files, totalFiles, totalSize);

      await waitFor(() => {
        expect(useModalStore.getState().toast.content).toBe(
          i18next.t('upload:text_file_over_length', {
            max_files: appConfig.maxFiles,
          }),
        );
        expect(result.length).toBe(1);
      });
    });
  });

  describe('validateVideo function', () => {
    it('given no selecting video should return video undefined', () => {
      expect(validateVideo(undefined, undefined).video).toBeUndefined();
    });

    it('given selecting video that is uploading should return videoUploading is true', () => {
      useUploaderStore.setState((state) => ({
        ...state,
        uploadingFiles: {
          123: 60,
        },
      }));
      expect(validateVideo({ fileName: '123' }, undefined).videoUploading).toBeTruthy();
    });

    it('given selecting video that is error should return videoError', () => {
      useUploaderStore.setState((state) => ({
        ...state,
        uploadedFiles: {
          123: {} as any,
        },
      }));
      expect(validateVideo({ fileName: '123' }, i18next.t).videoError).toBe(i18next.t('post:error_upload_failed'));
    });

    it('given selecting video and that video is uploaded should return video', () => {
      const videoUploaded = { id: '123', url: 'https://video.com/123' };
      useUploaderStore.setState((state) => ({
        ...state,
        uploadedFiles: {
          123: videoUploaded as any,
        },
      }));
      expect(isEqual(validateVideo({ fileName: '123' }, undefined).video, videoUploaded)).toBeTruthy();
    });
  });
});
