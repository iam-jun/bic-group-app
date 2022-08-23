import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

import ButtonApproveDeclineAllRequests from '~/screens/groups/components/ButtonApproveDeclineAllRequests';
import groupsActions from '~/storeRedux/groups/actions';
import {
  clearToastMessage,
  showAlert,
  showHideToastMessage,
} from '~/storeRedux/modal/actions';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useRootNavigation } from '~/hooks/navigation';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { IToastMessage } from '~/interfaces/common';
import { useBaseHook } from '~/hooks';

const CommunityApproveDeclineAllRequests = () => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const timeOutRef = useRef<any>();
  const { t } = useBaseHook();

  const { id: communityId, name } = useKeySelector(groupsKeySelector.communityDetail);
  const { total } = useKeySelector(groupsKeySelector.communityMemberRequests);

  const alertAction = (
    title: string,
    content: string,
    confirmLabel: string,
    doAction: () => void,
  ) => {
    const alertPayload = {
      title,
      content,
      cancelBtn: true,
      onConfirm: doAction,
      confirmLabel,
    };

    dispatch(showAlert(alertPayload));
  };

  const onPressDeclineAll = () => {
    alertAction(
      t('groups:text_respond_all_member_requests:title:decline'),
      t('groups:text_respond_all_member_requests:content:decline'),
      t('common:btn_decline_all'),
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

    timeOutRef.current = setTimeout(
      () => {
        dispatch(groupsActions.declineAllCommunityMemberRequests({ communityId }));
      }, 4500,
    );
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
      t('common:btn_approve_all'),
      doApproveAll,
    );
  };

  const doApproveAll = () => {
    dispatch(groupsActions.approveAllCommunityMemberRequests({
      communityId,
      callback: navigateToCommunityMembers,
    }));
  };

  const navigateToCommunityMembers = () => {
    dispatch(clearToastMessage());
    rootNavigation.navigate(
      groupStack.communityMembers, { communityId },
    );
  };

  return (
    <ButtonApproveDeclineAllRequests
      onPressDeclineAll={onPressDeclineAll}
      onPressApproveAll={onPressApproveAll}
    />
  );
};

export default CommunityApproveDeclineAllRequests;
