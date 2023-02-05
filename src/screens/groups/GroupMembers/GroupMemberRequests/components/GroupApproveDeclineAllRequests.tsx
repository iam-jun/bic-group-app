import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';

import { IToastMessage } from '~/interfaces/common';
import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import ButtonApproveDeclineAllRequests from '~/screens/groups/components/ButtonApproveDeclineAllRequests';
import { spacing } from '~/theme';
import useModalStore from '~/store/modal';
import useGroupMemberStore from '../../store';

const GroupApproveDeclineAllRequests = ({ groupId }: {groupId: string}) => {
  const timeOutRef = useRef<any>();
  const { t } = useBaseHook();

  const { total } = useGroupMemberStore((state) => state.groupMemberRequests);
  const actions = useGroupMemberStore((state) => state.actions);
  const { showToast, clearToast, showAlert } = useModalStore((state) => state.actions);

  const alertAction = ({
    title,
    content,
    confirmLabel,
    children,
    doAction,
  }:{
    title?: string;
    content?: string;
    confirmLabel?: string;
    children?: React.ReactNode | null
    doAction?: () => void
  }) => {
    const alertPayload = {
      title,
      content,
      cancelBtn: true,
      confirmLabel,
      children,
      onConfirm: doAction,
    };

    showAlert(alertPayload);
  };

  const onPressApproveAll = () => {
    alertAction({
      title: t('groups:text_respond_all_member_requests:title:approve'),
      children: (
        <Text.ParagraphM style={styles.childrenText}>
          {t('groups:text_respond_all_member_requests:content:text_about_to_add')}
          <Text.BodyMMedium>{total}</Text.BodyMMedium>
          {t('groups:text_respond_all_member_requests:content:approve_confirm_group')}
        </Text.ParagraphM>
      ),
      confirmLabel: t('common:btn_approve_all'),
      doAction: doApproveAll,
    });
  };

  const doApproveAll = () => {
    actions.approveAllGroupMemberRequests({ groupId, total });
  };

  const onPressDeclineAll = () => {
    alertAction({
      title: t('groups:text_respond_all_member_requests:title:decline'),
      content: t('groups:text_respond_all_member_requests:content:decline'),
      confirmLabel: t('common:btn_decline_all'),
      doAction: doDeclineAll,
    });
  };

  const onPressUndo = () => {
    timeOutRef?.current && clearTimeout(timeOutRef?.current);
    clearToast();
    actions.undoDeclinedGroupMemberRequests();
  };

  const doDeclineAll = () => {
    actions.storeUndoGroupMemberRequests();
    actions.resetGroupMemberRequests();

    // to show Empty screen component
    actions.setGroupMemberRequests({ loading: false });

    const toastMessage: IToastMessage = {
      content: `${t('groups:text_declining_all')}`.replace('{0}', String(total)),
      buttonText: t('common:text_undo'),
      duration: 5000,
      onButtonPress: onPressUndo,
    };
    showToast(toastMessage);

    timeOutRef.current = setTimeout(
      () => {
        actions.declineAllGroupMemberRequests({ groupId, total });
      }, 5500,
    );
  };

  return (
    <ButtonApproveDeclineAllRequests
      onPressDeclineAll={onPressDeclineAll}
      onPressApproveAll={onPressApproveAll}
    />
  );
};

const styles = StyleSheet.create({
  childrenText: {
    paddingTop: spacing.padding.tiny,
    paddingBottom: spacing.padding.base,
    paddingHorizontal: spacing.padding.large,
  },
});

export default GroupApproveDeclineAllRequests;
