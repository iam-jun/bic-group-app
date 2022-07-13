import React, {useRef} from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';

import modalActions, {clearToastMessage} from '~/store/modal/actions';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import {IToastMessage} from '~/interfaces/common';
import ButtonApproveDeclineAllRequests from '~/screens/Groups/components/ButtonApproveDeclineAllRequests';
import {useBaseHook} from '~/hooks';

const GroupApproveDeclineAllRequests = () => {
  const theme = useTheme() as ExtendedTheme;
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const timeOutRef = useRef<any>();
  const {t} = useBaseHook();

  const {id: groupId, name} =
    useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const {total} = useKeySelector(groupsKeySelector.groupMemberRequests);

  const navigateToGroupMembers = () => {
    dispatch(clearToastMessage());
    rootNavigation.navigate(groupStack.groupMembers, {groupId});
  };

  const alertAction = (
    title: string,
    content: string,
    doAction: () => void,
  ) => {
    const alertPayload = {
      title: title,
      content: content,
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      cancelBtnProps: {
        textColor: theme.colors.purple60,
      },
      onConfirm: () => doAction(),
      confirmLabel: t('common:btn_confirm'),
      ConfirmBtnComponent: Button.Secondary,
      confirmBtnProps: {highEmphasis: true},
    };

    dispatch(modalActions.showAlert(alertPayload));
  };

  const onPressApproveAll = () => {
    alertAction(
      t('groups:text_respond_all_member_requests:title:approve'),
      t('groups:text_respond_all_member_requests:content:approve', {
        count: total,
      }).replace('{0}', name),
      doApproveAll,
    );
  };

  const doApproveAll = () => {
    dispatch(
      groupsActions.approveAllGroupMemberRequests({
        groupId,
        callback: navigateToGroupMembers,
      }),
    );
  };

  const onPressDeclineAll = () => {
    alertAction(
      t('groups:text_respond_all_member_requests:title:decline'),
      t('groups:text_respond_all_member_requests:content:decline', {
        count: total,
      }),
      doDeclineAll,
    );
  };

  const onPressUndo = () => {
    timeOutRef?.current && clearTimeout(timeOutRef?.current);
    dispatch(clearToastMessage());
    dispatch(groupsActions.undoDeclinedGroupMemberRequests());
  };

  const doDeclineAll = () => {
    dispatch(groupsActions.storeUndoGroupMemberRequests());
    dispatch(groupsActions.resetGroupMemberRequests());

    const toastMessage: IToastMessage = {
      content: `${t('groups:text_declining_all')}`,
      props: {
        textProps: {useI18n: true},
        type: 'informative',
        rightText: 'Undo',
        onPressRight: onPressUndo,
      },
      duration: 4000,
      toastType: 'normal',
    };
    dispatch(modalActions.showHideToastMessage(toastMessage));

    timeOutRef.current = setTimeout(() => {
      dispatch(groupsActions.declineAllGroupMemberRequests({groupId}));
    }, 4500);
  };

  return (
    <ButtonApproveDeclineAllRequests
      onPressDeclineAll={onPressDeclineAll}
      onPressApproveAll={onPressApproveAll}
    />
  );
};

export default GroupApproveDeclineAllRequests;
