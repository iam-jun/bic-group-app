import { cloneDeep } from 'lodash';
import groupApi from '~/api/GroupApi';
import { previewSettings } from './helper';
import { previewSettingsResponse } from '~/test/mock_data/group';
import * as showToastError from '~/store/helper/showToastError';

describe('useMembershipPolicySettingsStore helper', () => {
  it('should call api success with data', async () => {
    jest.spyOn(groupApi, 'previewSettings').mockImplementation(() => Promise.resolve(previewSettingsResponse) as any);
    const payload = {
      groupId: 'test',
      settings: {
        isJoinApproval: true,
      },
    };
    const result = await previewSettings(payload);
    expect(result).toEqual(true);
  });

  it('should call api success no data', async () => {
    const cloneResponse = cloneDeep(previewSettingsResponse);
    cloneResponse.data.effectedInnerGroups = [];
    jest.spyOn(groupApi, 'previewSettings').mockImplementation(() => Promise.resolve(cloneResponse) as any);
    const payload = {
      groupId: 'test',
      settings: {
        isJoinApproval: true,
      },
    };
    const result = await previewSettings(payload);
    expect(result).toEqual(false);
  });

  it('should call api failed', async () => {
    const spyShowToastError = jest.spyOn(showToastError, 'default');
    try {
      jest.spyOn(groupApi, 'previewSettings').mockImplementation(() => Promise.reject('error') as any);
      const payload = {
        groupId: 'test',
        settings: {
          isJoinApproval: true,
        },
      };
      previewSettings(payload);
    } catch (error) {
      expect(spyShowToastError).toBeCalled();
    }
  });
});
