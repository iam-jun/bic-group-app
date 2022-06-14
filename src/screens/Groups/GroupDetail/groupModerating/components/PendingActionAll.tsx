import React, {useRef} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import modalActions, {clearToastMessage} from '~/store/modal/actions';
import i18next from 'i18next';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import {IToastMessage} from '~/interfaces/common';
import ButtonApproveDeclineAllRequests from '~/screens/Groups/components/ButtonApproveDeclineAllRequests';

interface PendingActionAllProps {
  groupId: number;
  style?: StyleProp<ViewStyle>;
}

const PendingActionAll = ({groupId, style}: PendingActionAllProps) => {
  const theme = useTheme() as ITheme;
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const timeOutRef = useRef<any>();

  const groupDetail = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const {total} = useKeySelector(groupsKeySelector.pendingMemberRequests);

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
        textColor: theme.colors.primary7,
      },
      onConfirm: () => doAction(),
      confirmLabel: i18next.t('common:btn_confirm'),
      ConfirmBtnComponent: Button.Secondary,
      confirmBtnProps: {highEmphasis: true},
    };

    dispatch(modalActions.showAlert(alertPayload));
  };

  const onPressApproveAll = () => {
    alertAction(
      i18next.t('groups:text_respond_all_member_requests:title:approve'),
      i18next
        .t('groups:text_respond_all_member_requests:content:approve', {
          count: total,
        })
        .replace('{0}', groupDetail?.name),
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
      i18next.t('groups:text_respond_all_member_requests:title:decline'),
      i18next.t('groups:text_respond_all_member_requests:content:decline', {
        count: total,
      }),
      doDeclineAll,
    );
  };

  const onPressUndo = () => {
    timeOutRef?.current && clearTimeout(timeOutRef?.current);
    dispatch(clearToastMessage());
    dispatch(groupsActions.undoDeclineMemberRequests());
  };

  const doDeclineAll = () => {
    dispatch(groupsActions.storeUndoData());
    dispatch(groupsActions.resetMemberRequests());

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_declining_all')}`,
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
      style={style}
      onPressDeclineAll={onPressDeclineAll}
      onPressApproveAll={onPressApproveAll}
    />
  );
};

export default PendingActionAll;
