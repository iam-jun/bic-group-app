import { act, renderHook } from '~/test/testUtils';
import useGroupController from '../index';
import useUploaderStore from '~/store/uploader';
import { FieldNameImageUpload } from '~/interfaces/IGroup';
import { ResourceUploadType } from '~/interfaces/IUpload';
import uploadApi from '~/api/UploadApi';
import groupApi from '~/api/GroupApi';

describe('uploadImage', () => {
  const payload = {
    destination: 'group' as const,
    fieldName: FieldNameImageUpload.ICON,
    file: {
      filename: '6E914741-2429-4D3C-97D1-28B7CED0B04E.jpg',
      height: 200,
      mime: 'image/jpeg',
      name: '6E914741-2429-4D3C-97D1-28B7CED0B04E.jpg',
      size: 16865,
      type: 'image/jpeg',
      uri: '/Users/lamanhquoc/Library/Developer/CoreSimulator/Devices/2786982A-C8E1-48AE-8AD9-AAEC68F4B5F0/data/Containers/Data/Application/93618FF6-3EDC-409D-83C2-1169F5721221/tmp/react-native-image-crop-picker/6E914741-2429-4D3C-97D1-28B7CED0B04E.jpg',
      width: 200,
    },
    id: '73f84c76-dc57-41d4-bdb0-5e454152f20a',
    rootGroupId: '22a637b3-61d4-45f5-af33-df25bd88f76f',
    uploadType: ResourceUploadType.groupAvatar,
  };

  const item = {
    id: '436edf60-96fa-460c-9c9e-d77941ddd2c1',
    name: '6E914741-2429-4D3C-97D1-28B7CED0B04E.jpg',
    result: ['Object'],
    size: 16865,
    uploadType: ResourceUploadType.groupAvatar,
    uploading: false,
    url: 'https://media.beincom.io/image/variants/group/avatar/436edf60-96fa-460c-9c9e-d77941ddd2c1',
  };

  const responseCreateImageId = {
    data: {
      data: {
        id: 'test',
        presignedPost: {
          fields: {},
          url: 'test',
        },
      },
    },
  };
  const responseUploadImageToS3 = {
    status: 204,
  };
  const responseGetImageStatus = {
    data: {
      data: {
        url: 'test',
      },
    },
  };

  it('should uploadImage group success:', () => {
    useUploaderStore.setState((state) => {
      state.uploadedFiles = { [item.name]: item };
      return state;
    });

    const responseEditGroupDetail = {
      data: {},
    };

    jest.spyOn(uploadApi, 'createImageId').mockImplementation(() => Promise.resolve(responseCreateImageId) as any);
    jest.spyOn(uploadApi, 'uploadImageToS3').mockImplementation(() => Promise.resolve(responseUploadImageToS3) as any);
    jest.spyOn(uploadApi, 'getImageStatus').mockImplementation(() => Promise.resolve(responseGetImageStatus) as any);
    const spy = jest
      .spyOn(groupApi, 'editGroupDetail')
      .mockImplementation(() => Promise.resolve(responseEditGroupDetail) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupController((state) => state));
    act(() => {
      result.current.actions.uploadImage(payload);
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
  });

  it('should uploadImage community success:', () => {
    const payloadClone = { ...payload, destination: 'community' as const, fieldName: FieldNameImageUpload.BACKGROUND_IMG };
    useUploaderStore.setState((state) => {
      state.uploadedFiles = { [item.name]: item };
      return state;
    });

    const responseGetCommunityDetail = {
      data: {},
    };

    jest.spyOn(uploadApi, 'createImageId').mockImplementation(() => Promise.resolve(responseCreateImageId) as any);
    jest.spyOn(uploadApi, 'uploadImageToS3').mockImplementation(() => Promise.resolve(responseUploadImageToS3) as any);
    jest.spyOn(uploadApi, 'getImageStatus').mockImplementation(() => Promise.resolve(responseGetImageStatus) as any);
    const spy = jest
      .spyOn(groupApi, 'getCommunityDetail')
      .mockImplementation(() => Promise.resolve(responseGetCommunityDetail) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupController((state) => state));
    act(() => {
      result.current.actions.uploadImage(payloadClone);
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
