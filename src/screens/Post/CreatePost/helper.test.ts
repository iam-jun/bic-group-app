import {validateImages} from '~/screens/Post/CreatePost/helper';
import {get} from 'lodash';
import {languages} from '~/test/testUtils';
import FileUploader from '~/services/fileUploader';
import {imagePicked} from '~/test/mock_data/file';

describe('CreatePost helper', () => {
  // @ts-ignore
  const t = (path: string) => get(languages, path?.replaceAll?.(':', '.'));
  const imageUrl =
    'https://bein-user-sharing-assets-sandbox.s3.ap-southeast-1.amazonaws.com/post/images/original/d47669b1-fd3c-4e15-9eb0-24162b4342bc.jpg';
  const fileParseFromEditPost = {
    fileName: '20220107_223640.jpg',
    file: {
      name: '20220107_223640.jpg',
      filename: '20220107_223640.jpg',
      width: 4032,
      height: 3024,
    },
    url: 'https://bein-user-sharing-assets-sandbox.s3.ap-southeast-1.amazonaws.com/post/images/original/d47669b1-fd3c-4e15-9eb0-24162b4342bc.jpg',
  };
  const fileValidated = {
    name: imageUrl,
    origin_name: '20220107_223640.jpg',
    width: 4032,
    height: 3024,
  };

  it('validateImages: validate empty array', () => {
    const result = validateImages([], t);
    expect(result).toEqual({images: [], imageError: '', imageUploading: false});
  });

  it('validateImages: validate picked 1 image upload success', () => {
    jest.spyOn(FileUploader, 'getInstance').mockImplementation(() => {
      return {
        getFile: jest.fn().mockImplementation(() => ({url: imageUrl})),
      } as any;
    });

    const result = validateImages([imagePicked] as any, t);
    expect(result).toEqual({
      images: [fileValidated],
      imageError: '',
      imageUploading: false,
    });
  });

  it('validateImages: validate picked 1 image uploading', () => {
    jest.spyOn(FileUploader, 'getInstance').mockImplementation(() => {
      return {
        getFile: jest
          .fn()
          .mockImplementation(() => ({url: imageUrl, uploading: true})),
      } as any;
    });

    const result = validateImages([imagePicked] as any, t);
    expect(result).toEqual({
      images: [fileValidated],
      imageError: languages.post.error_wait_uploading,
      imageUploading: true,
    });
  });

  it('validateImages: validate picked 1 image upload failed', () => {
    jest.spyOn(FileUploader, 'getInstance').mockImplementation(() => {
      return {
        getFile: jest.fn().mockImplementation(() => ({})),
      } as any;
    });

    const result = validateImages([imagePicked] as any, t);
    expect(result).toEqual({
      images: [{...fileValidated, name: ''}],
      imageError: languages.post.error_upload_failed,
      imageUploading: false,
    });
  });

  it('validateImages: validate file from edit post', () => {
    const result = validateImages([fileParseFromEditPost] as any, t);
    expect(result).toEqual({
      images: [fileValidated],
      imageError: '',
      imageUploading: false,
    });
  });
});
