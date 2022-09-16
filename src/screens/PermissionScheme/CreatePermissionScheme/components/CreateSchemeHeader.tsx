import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { isEqual } from 'lodash';

import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import groupsActions from '~/storeRedux/groups/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import modalActions from '~/storeRedux/modal/actions';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';

import { IScheme } from '~/interfaces/IGroup';

export interface CreateSchemeHeaderProps {
  style?: StyleProp<ViewStyle>;
  initScheme?: IScheme;
  loadingData: boolean;
  loadDataFailed: boolean;
  isEdit?: boolean;
  schemeId?: string;
}

const CreateSchemeHeader: FC<CreateSchemeHeaderProps> = ({
  initScheme,
  loadingData,
  loadDataFailed,
  isEdit,
  schemeId,
}: CreateSchemeHeaderProps) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const { id } = useKeySelector(groupsKeySelector.communityDetail) || {};
  const name = useKeySelector(groupsKeySelector.permission.creatingScheme.name);
  const desc = useKeySelector(groupsKeySelector.permission.creatingScheme.description);
  const creating = useKeySelector(groupsKeySelector.permission.creatingScheme.creating);
  const roles = useKeySelector(groupsKeySelector.permission.creatingScheme.roles);
  const groupScheme = useKeySelector(groupsKeySelector.permission.groupScheme) || {};
  const {
    name: initName,
    description: initDesc,
    roles: initRoles,
  } = initScheme || {};

  const disableButtonCreate = loadingData || loadDataFailed || !name;

  const onPress = () => {
    if (isEdit) {
      if (schemeId) {
        dispatch(groupsActions.updateGroupScheme({ communityId: id, schemeId }));
      } else dispatch(groupsActions.updateCommunityScheme({ communityId: id }));
    } else {
      dispatch(groupsActions.postCreateSchemePermission({ communityId: id }));
    }
  };

  const onPressBack = () => {
    if (
      name !== initName
      || desc !== initDesc
      || !isEqual(
        roles, initRoles || groupScheme?.roles,
      ) // initRoles = undefined for group
    ) {
      dispatch(modalActions.showAlert({
        title: t('communities:permission:text_title_discard_create_scheme'),
        content: t('communities:permission:text_desc_discard_create_scheme'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('communities:permission:btn_continue'),
        onCancel: () => rootNavigation.goBack(),
      }));
    } else {
      rootNavigation.goBack();
    }
  };

  useBackPressListener(onPressBack);

  return (
    <Header
      title={t(schemeId
        ? 'communities:permission:title_edit_group_scheme'
        : 'communities:permission:title_edit_community_scheme')}
      onPressButton={onPress}
      buttonText="common:btn_save"
      buttonProps={{
        loading: creating,
        disabled: disableButtonCreate,
        useI18n: true,
        style: { borderWidth: 0 },
        testID: 'common.btn_create',
      }}
      onPressBack={onPressBack}
    />
  );
};

export default CreateSchemeHeader;
