/* eslint-disable @typescript-eslint/ban-ts-comment */
import { get } from 'lodash';
import { validateImages, validateVideo } from '~/screens/Post/CreatePost/helper';
import { languages } from '~/test/testUtils';
import FileUploader from '~/services/fileUploader';
import { imagePicked, videoSelected, videoUploaded } from '~/test/mock_data/file';

describe('CreatePost helper', () => {
  // @ts-ignore
  const t = (path: string) => get(languages, path?.replaceAll?.(':', '.'));
  const imageUrl
    = 'https://bein-user-sharing-assets-sandbox.s3.ap-southeast-1.amazonaws.com/post/images/original/d47669b1-fd3c-4e15-9eb0-24162b4342bc.jpg';
  const imageParseFromEditPost = {
    fileName: '20220107_223640.jpg',
    file: {
      name: '20220107_223640.jpg',
      filename: '20220107_223640.jpg',
      width: 4032,
      height: 3024,
    },
    url: 'https://bein-user-sharing-assets-sandbox.s3.ap-southeast-1.amazonaws.com/post/images/original/d47669b1-fd3c-4e15-9eb0-24162b4342bc.jpg',
  };
  const imageValidated = {
    name: imageUrl,
    origin_name: '20220107_223640.jpg',
    width: 4032,
    height: 3024,
  };

  it('validateImages: validate empty array', () => {
    const result = validateImages([], t);
    expect(result).toEqual({ images: [], imageError: '', imageUploading: false });
  });

  it('validateImages: validate picked 1 image upload success', () => {
    jest.spyOn(FileUploader, 'getInstance').mockImplementation(() => ({
      getFile: jest.fn().mockImplementation(() => ({ url: imageUrl })),
    } as any));

    const result = validateImages([imagePicked] as any, t);
    expect(result).toEqual({
      images: [{
        ...imageValidated,
        id: undefined,
        name: '',
      }],
      imageError: languages.post.error_upload_failed,
      imageUploading: false,
    });
  });

  it('validateImages: validate picked 1 image uploading', () => {
    jest.spyOn(FileUploader, 'getInstance').mockImplementation(() => ({
      getFile: jest
        .fn()
        .mockImplementation(() => ({ url: imageUrl, uploading: true })),
    } as any));

    const result = validateImages([imagePicked] as any, t);
    expect(result).toEqual({
      images: [{
        ...imageValidated,
        id: undefined,
        name: '',
      }],
      imageError: languages.post.error_upload_failed,
      imageUploading: false,
    });
  });

  it('validateImages: validate picked 1 image upload failed', () => {
    jest.spyOn(FileUploader, 'getInstance').mockImplementation(() => ({
      getFile: jest.fn().mockImplementation(() => ({})),
    } as any));

    const result = validateImages([imagePicked] as any, t);
    expect(result).toEqual({
      images: [{ ...imageValidated, name: '' }],
      imageError: languages.post.error_upload_failed,
      imageUploading: false,
    });
  });

  it('validateImages: validate file from edit post', () => {
    const result = validateImages([imageParseFromEditPost] as any, t);
    expect(result).toEqual({
      images: [imageValidated],
      imageError: '',
      imageUploading: false,
    });
  });

  it('validateVideo: return empty data if invalid input video', () => {
    const result = validateVideo(undefined, t);
    expect(result).toEqual({
      video: undefined,
      videoError: '',
    });
  });

  it('validateVideo: return empty data if invalid input video', () => {
    const result = validateVideo(undefined, t);
    expect(result).toEqual({
      video: undefined,
      videoError: '',
    });
  });

  it('validateVideo: return selected file if it has been uploaded (has id)', () => {
    const result = validateVideo(videoUploaded, t);
    expect(result).toEqual({
      video: videoUploaded,
      videoError: '',
      videoUploading: false,
    });
  });

  it('validateVideo: return error uploading file', () => {
    jest.spyOn(FileUploader, 'getInstance').mockImplementation(() => ({
      getFile: jest
        .fn()
        .mockImplementation(() => ({ uploading: true, result: videoUploaded })),
    } as any));

    const result = validateVideo(videoSelected, t);
    expect(result).toEqual({
      video: undefined,
      videoError: languages.post.error_wait_uploading,
      videoUploading: true,
    });
  });

  it('validateVideo: return error upload failed', () => {
    jest.spyOn(FileUploader, 'getInstance').mockImplementation(() => ({
      getFile: jest
        .fn()
        .mockImplementation(() => ({ uploading: false, result: {} })),
    } as any));

    const result = validateVideo(videoSelected, t);
    expect(result).toEqual({
      video: undefined,
      videoError: languages.post.error_upload_failed,
      videoUploading: false,
    });
  });

  it('validateVideo: return file uploaded', () => {
    jest.spyOn(FileUploader, 'getInstance').mockImplementation(() => ({
      getFile: jest.fn().mockImplementation(() => ({
        uploading: false,
        result: videoUploaded,
      })),
    } as any));

    const result = validateVideo(videoSelected, t);
    expect(result).toEqual({
      video: videoUploaded,
      videoError: '',
      videoUploading: false,
    });
  });
});
