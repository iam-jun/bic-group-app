import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { isEqual } from 'lodash';

import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';

import { IScheme } from '~/interfaces/IGroup';
import usePermissionSchemeStore from '../../store';
import useModalStore from '~/store/modal';

export interface CreateSchemeHeaderProps {
  style?: StyleProp<ViewStyle>;
  initScheme?: IScheme;
  loadingData: boolean;
  loadDataFailed: boolean;
  isEdit?: boolean;
  schemeId?: string;
  communityId? : string;
}

const CreateSchemeHeader: FC<CreateSchemeHeaderProps> = ({
  initScheme,
  loadingData,
  loadDataFailed,
  isEdit,
  schemeId,
  communityId,
}: CreateSchemeHeaderProps) => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const { showAlert } = useModalStore((state) => state.actions);
  const actions = usePermissionSchemeStore((state) => state.actions);
  const groupSchemeData = usePermissionSchemeStore((state) => state.groupScheme.data) || {};
  const creating = usePermissionSchemeStore((state) => state.creatingScheme.creating);
  const creatingSchemeData = usePermissionSchemeStore((state) => state.creatingScheme.data);
  const {
    name, description, roles,
  } = creatingSchemeData || {};

  const {
    name: initName,
    description: initDescription,
    roles: initRoles,
  } = initScheme || {};

  const disableButtonCreate = loadingData || loadDataFailed || !name;

  const onPress = () => {
    if (isEdit) {
      if (schemeId) {
        actions.updateGroupScheme({ communityId, schemeId });
      } else actions.updateGeneralScheme(communityId);
    } else {
      actions.createGeneralScheme(communityId);
    }
  };

  const onPressBack = () => {
    if (
      name !== initName
      || description !== initDescription
      || !isEqual(
        roles,
        initRoles || groupSchemeData?.roles, // initRoles = undefined for group
      )
    ) {
      showAlert({
        title: t('communities:permission:text_title_discard_create_scheme'),
        content: t('communities:permission:text_desc_discard_create_scheme'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('communities:permission:btn_continue'),
        onCancel: () => rootNavigation.goBack(),
      });
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
