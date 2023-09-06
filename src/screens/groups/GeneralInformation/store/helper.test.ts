import { cloneDeep } from 'lodash';
import groupApi from '~/api/GroupApi';
import { previewPrivacyResponse } from '~/test/mock_data/group';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import { previewPrivacy } from './helper';
import * as showToastError from '~/store/helper/showToastError';

describe('useGeneralInformationStore helper', () => {
  it('should call api success with data case membership approval', async () => {
    jest.spyOn(groupApi, 'previewPrivacy').mockImplementation(() => Promise.resolve(previewPrivacyResponse) as any);
    const payload = {
      groupId: 'test',
      data: {
        privacy: GroupPrivacyType.PRIVATE,
      },
    };
    const result = await previewPrivacy(payload);
    expect(result).toEqual(true);
  });

  it('should call api success with data case badge', async () => {
    const cloneResponse = cloneDeep(previewPrivacyResponse);
    cloneResponse.data.affectedInnerGroupsMembershipApproval = [];
    cloneResponse.data.badge = { id: 'test', name: 'test', iconUrl: 'test' };
    jest.spyOn(groupApi, 'previewPrivacy').mockImplementation(() => Promise.resolve(cloneResponse) as any);
    const payload = {
      groupId: 'test',
      data: {
        privacy: GroupPrivacyType.SECRET,
      },
    };
    const result = await previewPrivacy(payload);
    expect(result).toEqual(true);
  });

  it('should call api success no data', async () => {
    const cloneResponse = cloneDeep(previewPrivacyResponse);
    cloneResponse.data.affectedInnerGroupsMembershipApproval = [];
    jest.spyOn(groupApi, 'previewPrivacy').mockImplementation(() => Promise.resolve(cloneResponse) as any);
    const payload = {
      groupId: 'test',
      data: {
        privacy: GroupPrivacyType.PRIVATE,
      },
    };
    const result = await previewPrivacy(payload);
    expect(result).toEqual(false);
  });

  it('should call api failed', async () => {
    const spyShowToastError = jest.spyOn(showToastError, 'default');
    try {
      jest.spyOn(groupApi, 'previewPrivacy').mockImplementation(() => Promise.reject('error') as any);
      const payload = {
        groupId: 'test',
        data: {
          privacy: GroupPrivacyType.PRIVATE,
        },
      };
      previewPrivacy(payload);
    } catch (error) {
      expect(spyShowToastError).toBeCalled();
    }
  });
});
