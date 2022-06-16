import React, {FC} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';

export interface CreateSchemeHeaderProps {
  style?: StyleProp<ViewStyle>;
  loadingData: boolean;
  loadDataFailed: boolean;
}

const CreateSchemeHeader: FC<CreateSchemeHeaderProps> = ({
  loadingData,
  loadDataFailed,
}: CreateSchemeHeaderProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();

  const {id} = useKeySelector(groupsKeySelector.communityDetail) || {};
  const name = useKeySelector(groupsKeySelector.permission.creatingScheme.name);
  const creating = useKeySelector(
    groupsKeySelector.permission.creatingScheme.creating,
  );

  const disableButtonCreate = loadingData || loadDataFailed || !name;

  const onPressCreate = () => {
    dispatch(groupsActions.postCreateSchemePermission({communityId: id}));
  };

  return (
    <Header
      title={t('communities:permission:title_create_community_scheme')}
      onPressButton={onPressCreate}
      buttonText={'common:btn_create'}
      buttonProps={{
        loading: creating,
        disabled: disableButtonCreate,
        useI18n: true,
        highEmphasis: true,
        style: {borderWidth: 0},
        testID: 'common.btn_create',
      }}
    />
  );
};

export default CreateSchemeHeader;
