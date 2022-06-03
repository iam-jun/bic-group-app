import {StyleProp, ViewStyle} from 'react-native';
import React, {useRef} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import ButtonApproveDeclineAllRequests from '~/beinComponents/ButtonApproveDeclineAllRequests';
import groupsActions from '../../redux/actions';
import {
  clearToastMessage,
  showAlert,
  showHideToastMessage,
} from '~/store/modal/actions';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import {IToastMessage} from '~/interfaces/common';

interface ActionProps {
  style?: StyleProp<ViewStyle>;
}

const ApproveDeclineAllRequests = ({style}: ActionProps) => {
  const theme = useTheme() as ITheme;
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const timeOutRef = useRef<any>();

  const {id: communityId, name} = useKeySelector(
    groupsKeySelector.communityDetail,
  );
  const {total} = useKeySelector(groupsKeySelector.communityMemberRequests);

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
      onConfirm: doAction,
      confirmLabel: i18next.t('common:btn_confirm'),
      ConfirmBtnComponent: Button.Secondary,
      confirmBtnProps: {highEmphasis: true},
    };

    dispatch(showAlert(alertPayload));
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

  const doDeclineAll = () => {
    dispatch(groupsActions.storeUndoCommunityMemberRequests());
    dispatch(groupsActions.resetCommunityMemberRequests());

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_declining_all', {
        count: total,
      })}`,
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

    timeOutRef.current = setTimeout(() => {
      dispatch(
        groupsActions.declineAllCommunityMemberRequests({
          communityId,
          total: total,
        }),
      );
    }, 4500);
  };

  const onPressUndo = () => {
    timeOutRef?.current && clearTimeout(timeOutRef?.current);
    dispatch(clearToastMessage());
    dispatch(groupsActions.undoDeclinedCommunityMemberRequests());
  };

  const onPressApproveAll = () => {
    alertAction(
      i18next.t('groups:text_respond_all_member_requests:title:approve'),
      i18next
        .t('groups:text_respond_all_member_requests:content:approve', {
          count: total,
        })
        .replace('{0}', name),
      doApproveAll,
    );
  };

  const doApproveAll = () => {
    dispatch(
      groupsActions.approveAllCommunityMemberRequests({
        communityId,
        total,
        callback: navigateToCommunityMembers,
      }),
    );
  };

  const navigateToCommunityMembers = () => {
    dispatch(clearToastMessage());
    rootNavigation.navigate(groupStack.communityMembers, {communityId});
  };

  return (
    <ButtonApproveDeclineAllRequests
      style={style}
      onPressDeclineAll={onPressDeclineAll}
      onPressApproveAll={onPressApproveAll}
    />
  );
};

export default ApproveDeclineAllRequests;
