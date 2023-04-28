import groupApi from '~/api/GroupApi';
import { onRefresh } from './helper';
import useTimelineStore from '~/store/timeline';

describe('helper groupDetail', () => {
  it('should onRefresh correctly', async () => {
    const payload = {
      setIsRefreshing: jest.fn(),
      groupId: 'test',
    };

    useTimelineStore.getState().actions.initDataTimeline(payload.groupId);

    const spyApiGetGroupDetail = jest
      .spyOn(groupApi, 'getGroupDetail')
      .mockImplementation(() => Promise.resolve(true) as any);

    await onRefresh(payload);

    expect(spyApiGetGroupDetail).toBeCalled();
  });
});
