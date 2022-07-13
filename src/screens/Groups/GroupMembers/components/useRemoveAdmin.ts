import React from 'react';
import i18next from 'i18next';
import {useDispatch} from 'react-redux';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {IGroupMembers} from '~/interfaces/IGroup';

import modalActions from '~/store/modal/actions';
import groupsActions from '../../redux/actions';

interface IUseRemoveAdmin {
  groupId: number;
  selectedMember: IGroupMembers;
}

const useRemoveAdmin = ({groupId, selectedMember}: IUseRemoveAdmin) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ExtendedTheme;

  const {id: userId, fullname} = selectedMember;

  const doRemoveAdmin = () => {
    userId && dispatch(groupsActions.removeGroupAdmin({groupId, userId}));
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
  alertPayload.content = alertPayload.content.replace('{0}', `"${fullname}"`);

  const alertRemovingAdmin = () =>
    dispatch(modalActions.showAlert(alertPayload));

  return alertRemovingAdmin;
};

export default useRemoveAdmin;
