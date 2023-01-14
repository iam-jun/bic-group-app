import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';

import ButtonApproveDeclineAllRequests from '~/screens/groups/components/ButtonApproveDeclineAllRequests';
import { IToastMessage } from '~/interfaces/common';
import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import { ICommunity } from '~/interfaces/ICommunity';
import useCommunityMemberStore from '~/screens/communities/CommunityMembers/store';
import useModalStore from '~/store/modal';

const CommunityApproveDeclineAllRequests = ({ community }: {community: ICommunity}) => {
  const timeOutRef = useRef<any>();
  const { t } = useBaseHook();

  const { id: communityId, groupId } = community || {};
  const { total } = useCommunityMemberStore((state) => state.communityMemberRequests);
  const communityMemberActions = useCommunityMemberStore((state) => state.actions);
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

  const onPressDeclineAll = () => {
    alertAction({
      title: t('groups:text_respond_all_member_requests:title:decline'),
      content: t('groups:text_respond_all_member_requests:content:decline'),
      confirmLabel: t('common:btn_decline_all'),
      doAction: doDeclineAll,
    });
  };

  const doDeclineAll = () => {
    communityMemberActions.storeUndoCommunityMemberRequests();
    communityMemberActions.resetCommunityMemberRequests();
    communityMemberActions.setCommunityMemberRequests({ loading: false }); // to show Empty screen component

    const toastMessage: IToastMessage = {
      content: `${t('groups:text_declining_all')}`.replace('{0}', String(total)),
      buttonText: t('common:text_undo'),
      onButtonPress: onPressUndo,
      duration: 5000,
    };
    showToast(toastMessage);

    timeOutRef.current = setTimeout(
      () => {
        communityMemberActions.declineAllCommunityMemberRequests({ groupId, total });
      }, 5500,
    );
  };

  const onPressUndo = () => {
    timeOutRef?.current && clearTimeout(timeOutRef?.current);
    clearToast();
    communityMemberActions.undoDeclinedCommunityMemberRequests();
  };

  const onPressApproveAll = () => {
    alertAction({
      title: t('groups:text_respond_all_member_requests:title:approve'),
      children: (
        <Text.ParagraphM style={styles.childrenText}>
          {t('groups:text_respond_all_member_requests:content:text_about_to_add')}
          <Text.BodyMMedium>{total}</Text.BodyMMedium>
          {t('groups:text_respond_all_member_requests:content:approve_confirm_community')}
        </Text.ParagraphM>
      ),
      confirmLabel: t('common:btn_approve_all'),
      doAction: doApproveAll,
    });
  };

  const doApproveAll = () => {
    communityMemberActions.approveAllCommunityMemberRequests({ communityId, groupId, total });
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

export default CommunityApproveDeclineAllRequests;
