import React, { useRef } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import ButtonApproveDeclineAllRequests from '~/screens/Groups/components/ButtonApproveDeclineAllRequests';
import groupsActions from '../../redux/actions';
import {
  clearToastMessage,
  showAlert,
  showHideToastMessage,
} from '~/store/modal/actions';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import { useRootNavigation } from '~/hooks/navigation';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import { IToastMessage } from '~/interfaces/common';
import { useBaseHook } from '~/hooks';

const CommunityApproveDeclineAllRequests = () => {
  const theme: ExtendedTheme = useTheme();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const timeOutRef = useRef<any>();
  const { t } = useBaseHook();

  const { id: communityId, name } = useKeySelector(
    groupsKeySelector.communityDetail,
  );
  const { total } = useKeySelector(groupsKeySelector.communityMemberRequests);

  const alertAction = (
    title: string,
    content: string,
    doAction: () => void,
  ) => {
    const alertPayload = {
      title,
      content,
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      cancelBtnProps: {
        textColor: theme.colors.purple60,
      },
      onConfirm: doAction,
      confirmLabel: t('common:btn_confirm'),
      ConfirmBtnComponent: Button.Secondary,
      confirmBtnProps: { highEmphasis: true },
    };

    dispatch(showAlert(alertPayload));
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

  const doDeclineAll = () => {
    dispatch(groupsActions.storeUndoCommunityMemberRequests());
    dispatch(groupsActions.resetCommunityMemberRequests());

    const toastMessage: IToastMessage = {
      content: `${t('groups:text_declining_all')}`,
      props: {
        textProps: { useI18n: true },
        type: 'informative',
        rightText: 'Undo',
        onPressRight: onPressUndo,
      },
      duration: 4000,
      toastType: 'normal',
    };
    dispatch(showHideToastMessage(toastMessage));

    timeOutRef.current = setTimeout(() => {
      dispatch(groupsActions.declineAllCommunityMemberRequests({ communityId }));
    }, 4500);
  };

  const onPressUndo = () => {
    timeOutRef?.current && clearTimeout(timeOutRef?.current);
    dispatch(clearToastMessage());
    dispatch(groupsActions.undoDeclinedCommunityMemberRequests());
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
      groupsActions.approveAllCommunityMemberRequests({
        communityId,
        callback: navigateToCommunityMembers,
      }),
    );
  };

  const navigateToCommunityMembers = () => {
    dispatch(clearToastMessage());
    rootNavigation.navigate(groupStack.communityMembers, { communityId });
  };

  return (
    <ButtonApproveDeclineAllRequests
      onPressDeclineAll={onPressDeclineAll}
      onPressApproveAll={onPressApproveAll}
    />
  );
};

export default CommunityApproveDeclineAllRequests;
