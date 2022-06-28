import React, {FC} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';
import {ITheme} from '~/theme/interfaces';

export interface CreateSchemeHeaderProps {
  style?: StyleProp<ViewStyle>;
  loadingData: boolean;
  loadDataFailed: boolean;
  isEdit?: boolean;
}

const CreateSchemeHeader: FC<CreateSchemeHeaderProps> = ({
  loadingData,
  loadDataFailed,
  isEdit,
}: CreateSchemeHeaderProps) => {
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;

  const {id} = useKeySelector(groupsKeySelector.communityDetail) || {};
  const name = useKeySelector(groupsKeySelector.permission.creatingScheme.name);
  const desc = useKeySelector(
    groupsKeySelector.permission.creatingScheme.description,
  );
  const creating = useKeySelector(
    groupsKeySelector.permission.creatingScheme.creating,
  );

  const disableButtonCreate = loadingData || loadDataFailed || !name;

  const onPress = () => {
    if (isEdit) {
      dispatch(groupsActions.updateCommunityScheme({communityId: id}));
    } else {
      dispatch(groupsActions.postCreateSchemePermission({communityId: id}));
    }
  };

  const onPressBack = () => {
    if (name || desc) {
      dispatch(
        modalActions.showAlert({
          title: t('communities:permission:text_title_discard_create_scheme'),
          content: t('communities:permission:text_desc_discard_create_scheme'),
          cancelBtn: true,
          cancelLabel: t('common:btn_discard'),
          confirmLabel: t('communities:permission:btn_continue'),
          cancelBtnProps: {textColor: theme.colors.textPrimary},
          onDismiss: () => rootNavigation.goBack(),
        }),
      );
    } else {
      rootNavigation.goBack();
    }
  };

  return (
    <Header
      title={t('communities:permission:title_create_community_scheme')}
      onPressButton={onPress}
      buttonText={'common:btn_save'}
      buttonProps={{
        loading: creating,
        disabled: disableButtonCreate,
        useI18n: true,
        highEmphasis: true,
        style: {borderWidth: 0},
        testID: 'common.btn_create',
      }}
      onPressBack={onPressBack}
    />
  );
};

export default CreateSchemeHeader;
