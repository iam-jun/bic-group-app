import React, {useRef} from 'react';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import {clearToastMessage, showHideToastMessage} from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import {IToastMessage} from '~/interfaces/common';
import PendingUserItem from '~/screens/Groups/components/PendingUserItem';

const GroupMemberRequest = ({requestId}: {requestId: number}) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const timeoutRef = useRef<any>();

  const pendingMemberRequests = useKeySelector(
    groupsKeySelector.pendingMemberRequests,
  );
  const {items} = pendingMemberRequests;

  const requestItem = items[requestId];
  const {group_id: groupId, user} = requestItem;
  const {fullname: fullName} = user;

  const navigateToGroupMembers = () => {
    dispatch(clearToastMessage());
    rootNavigation.navigate(groupStack.groupMembers, {groupId});
  };

  const onPressApprove = () => {
    dispatch(
      groupsActions.approveSingleMemberRequest({
        groupId,
        requestId,
        fullName,
        callback: navigateToGroupMembers,
      }),
    );
  };

  const onPressUndo = () => {
    timeoutRef?.current && clearTimeout(timeoutRef?.current);
    dispatch(clearToastMessage());
    dispatch(groupsActions.undoDeclineMemberRequests());
  };

  const onPressDecline = () => {
    dispatch(groupsActions.storeUndoData());
    dispatch(groupsActions.removeSingleMemberRequest({requestId}));

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_declining_user')} ${fullName}`,
      props: {
        textProps: {useI18n: true},
        type: 'informative',
        rightText: 'Undo',
        onPressRight: onPressUndo,
      },
      duration: 4000,
      toastType: 'normal',
    };
    dispatch(showHideToastMessage(toastMessage));

    timeoutRef.current = setTimeout(() => {
      dispatch(
        groupsActions.declineSingleMemberRequest({
          groupId,
          requestId,
          fullName,
        }),
      );
    }, 4500);
  };

  return (
    <PendingUserItem
      requestItem={requestItem}
      onPressApprove={onPressApprove}
      onPressDecline={onPressDecline}
    />
  );
};

export default GroupMemberRequest;
