import useTimelineStore from '~/store/timeline';
import useGroupDetailStore from '../store';
import usePinContentStore from '~/components/PinContent/store';
import useTermStore from '~/components/TermsModal/store';

export const onRefresh = async (props: {
  setIsRefreshing: (value: boolean) => void;
  groupId: string;
  isPrivacyGroup?: boolean;
}) => {
  const { setIsRefreshing, groupId, isPrivacyGroup = false } = props;

  setIsRefreshing(true);

  await Promise.all([
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId }),
    isPrivacyGroup && useTermStore.getState().actions.getTermsData(groupId),
    useTimelineStore.getState().actions.getPosts(groupId, true),
    usePinContentStore.getState().actions.getPinContentsGroup(groupId),
  ]);

  setIsRefreshing(false);
};
