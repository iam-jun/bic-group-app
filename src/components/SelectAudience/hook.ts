import { isEmpty, isEqual } from 'lodash';
import useSelectAudienceStore from './store';

const useSelectAudience = (initAudienceIds) => {
  const actions = useSelectAudienceStore((state) => state.actions);
  const selectedIds = useSelectAudienceStore((state) => state.selectedIds);

  // self check instead of use enableButtonSave from hook to avoid delay
  const isUpdated = !isEqual(initAudienceIds, selectedIds)
    && !(isEmpty(selectedIds?.groupIds) && isEmpty(selectedIds?.userIds));

  return {
    actions,
    selectedIds,
    isUpdated,
  };
};

export default useSelectAudience;
