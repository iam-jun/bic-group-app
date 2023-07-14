import { cloneDeep } from 'lodash';
import groupApi from '~/api/GroupApi';
import { getPreviewJoinableGroup } from './helper';
import { getPreviewJoinableGroupResponse } from '~/test/mock_data/group';

describe('PreviewJoinableGroup helper', () => {
  it('should call api success with data', async () => {
    jest
      .spyOn(groupApi, 'getPreviewJoinableGroup')
      .mockImplementation(() => Promise.resolve(getPreviewJoinableGroupResponse) as any);

    const result = await getPreviewJoinableGroup('groupId');
    expect(result).toEqual(true);
  });

  it('should call api success with no data', async () => {
    const cloneResponse = cloneDeep(getPreviewJoinableGroupResponse);
    cloneResponse.data.children = [];
    jest.spyOn(groupApi, 'getPreviewJoinableGroup').mockImplementation(() => Promise.resolve(cloneResponse) as any);

    const result = await getPreviewJoinableGroup('groupId');
    expect(result).toEqual(false);
  });
});
