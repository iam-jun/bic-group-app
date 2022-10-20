import React, { FC } from 'react';

import { isEqual } from 'lodash';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import modalActions from '~/storeRedux/modal/actions';
import useGroupStructureStore from '../../store';

export interface ReorderGroupHeaderProps {
  communityId: string;
  initOrder?: any;
}

const ReorderGroupHeader: FC<ReorderGroupHeaderProps> = ({
  communityId,
  initOrder,
}: ReorderGroupHeaderProps) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const groupStructureActions = useGroupStructureStore((state) => state.actions);

  const { loading, newOrder } = useGroupStructureStore((state) => state.reorder) || {};

  const hasChanged = !!newOrder && !isEqual(
    newOrder, initOrder,
  );
  const disabled = loading || !hasChanged;

  const onPressSave = () => {
    if (communityId && newOrder) {
      const title = t('communities:group_structure:text_title_confirm_reorder_group');
      const content = t('communities:group_structure:text_desc_confirm_reorder_group');
      dispatch(modalActions.showAlert({
        title,
        content,
        cancelBtn: true,
        cancelLabel: t('common:btn_cancel'),
        confirmLabel: t('common:btn_confirm'),
        onConfirm: () => {
          groupStructureActions.putGroupStructureReorder({ communityId, newOrder });
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
        style: { borderWidth: 0 },
        testID: 'reorder_group.btn_save',
      }}
    />
  );
};

export default ReorderGroupHeader;
