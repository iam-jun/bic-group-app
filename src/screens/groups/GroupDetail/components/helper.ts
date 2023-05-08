import useTimelineStore from '~/store/timeline';
import useGroupDetailStore from '../store';
import usePinContentStore from '~/components/PinContent/store';

export const onRefresh = async (props: { setIsRefreshing: (value: boolean) => void; groupId: string }) => {
  const { setIsRefreshing, groupId } = props;

  setIsRefreshing(true);

  await Promise.all([
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId }),
    useTimelineStore.getState().actions.getPosts(groupId, true),
    usePinContentStore.getState().actions.getPinContentsGroup(groupId),
  ]);

  setIsRefreshing(false);
};
