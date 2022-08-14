import { ExtendedTheme, useTheme } from '@react-navigation/native';
import i18next from 'i18next';
import { useDispatch } from 'react-redux';

import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import { IGroupMembers } from '~/interfaces/IGroup';

import modalActions from '~/storeRedux/modal/actions';
import groupsActions from '../../../../storeRedux/groups/actions';

interface IUseRemoveAdmin {
  groupId: string;
  selectedMember: IGroupMembers;
}

const useRemoveAdmin = ({ groupId, selectedMember }: IUseRemoveAdmin) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();

  const { id: userId, fullname } = selectedMember;

  const doRemoveAdmin = () => {
    userId && dispatch(groupsActions.removeGroupAdmin({ groupId, userId }));
  };

  const alertPayload = {
    iconName: 'StarHalfAlt',
    title: i18next.t('groups:modal_confirm_remove_admin:title'),
    content: i18next.t('groups:modal_confirm_remove_admin:description'),
    ContentComponent: Text.BodyS,
    cancelBtn: true,
    cancelBtnProps: {
      textColor: theme.colors.purple60,
    },
    onConfirm: doRemoveAdmin,
    confirmLabel: i18next.t('groups:modal_confirm_remove_admin:button_confirm'),
    ConfirmBtnComponent: Button.Danger,
  };
  alertPayload.content = alertPayload.content.replace(
    '{0}', `"${fullname}"`,
  );

  const alertRemovingAdmin = () => dispatch(modalActions.showAlert(alertPayload));

  return alertRemovingAdmin;
};

export default useRemoveAdmin;
