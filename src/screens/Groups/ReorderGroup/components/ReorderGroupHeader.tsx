import React, { FC } from 'react';

import { isEqual } from 'lodash';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import modalActions from '~/store/modal/actions';

export interface ReorderGroupHeaderProps {
  initOrder?: any;
  groupName?: string;
}

const ReorderGroupHeader: FC<ReorderGroupHeaderProps> = ({
  initOrder,
  groupName,
}: ReorderGroupHeaderProps) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const { id: communityId } = useKeySelector(groupsKeySelector.communityDetail);
  const { loading, newOrder } = useKeySelector(groupsKeySelector.groupStructure.reorder);

  const hasChanged = !!newOrder && !isEqual(
    newOrder, initOrder,
  );
  const disabled = loading || !hasChanged;

  const onPressSave = () => {
    if (communityId && newOrder) {
      const title = t('communities:group_structure:text_title_confirm_reorder_group').replaceAll(
        '%NAME%', groupName,
      );
      const content = t('communities:group_structure:text_desc_confirm_reorder_group');
      dispatch(modalActions.showAlert({
        title,
        content,
        cancelBtn: true,
        cancelLabel: t('common:btn_cancel'),
        confirmLabel: t('common:btn_confirm'),
        onConfirm: () => {
          dispatch(groupsActions.putGroupStructureReorder({ communityId, newOrder }));
        },
      }));
    }
  };

  return (
    <Header
      title={t('communities:group_structure:title_reorder_group')}
      onPressButton={onPressSave}
      buttonText="common:btn_save"
      buttonProps={{
        loading,
        disabled,
        useI18n: true,
        highEmphasis: true,
        style: { borderWidth: 0 },
        testID: 'reorder_group.btn_save',
      }}
    />
  );
};

export default ReorderGroupHeader;
