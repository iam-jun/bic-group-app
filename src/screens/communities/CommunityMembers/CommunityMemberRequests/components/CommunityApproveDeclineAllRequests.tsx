import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet } from 'react-native';

import ButtonApproveDeclineAllRequests from '~/screens/groups/components/ButtonApproveDeclineAllRequests';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { IToastMessage } from '~/interfaces/common';
import { useBaseHook } from '~/hooks';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';

const CommunityApproveDeclineAllRequests = ({ communityId }: {communityId: string}) => {
  const dispatch = useDispatch();
  const timeOutRef = useRef<any>();
  const { t } = useBaseHook();

  const { total } = useKeySelector(groupsKeySelector.communityMemberRequests);

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

    dispatch(modalActions.showAlert(alertPayload));
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
    dispatch(groupsActions.storeUndoCommunityMemberRequests());
    dispatch(groupsActions.resetCommunityMemberRequests());
    dispatch(groupsActions.setCommunityMemberRequests({ loading: false })); // to show Empty screen component

    const toastMessage: IToastMessage = {
      content: `${t('groups:text_declining_all')}`.replace('{0}', total),
      props: {
        buttonText: 'Undo',
        onButtonPress: onPressUndo,
      },
      duration: 5000,
    };
    dispatch(modalActions.showHideToastMessage(toastMessage));

    timeOutRef.current = setTimeout(
      () => {
        dispatch(groupsActions.declineAllCommunityMemberRequests({ communityId, total }));
      }, 5500,
    );
  };

  const onPressUndo = () => {
    timeOutRef?.current && clearTimeout(timeOutRef?.current);
    dispatch(modalActions.clearToastMessage());
    dispatch(groupsActions.undoDeclinedCommunityMemberRequests());
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
    dispatch(groupsActions.approveAllCommunityMemberRequests({ communityId, total }));
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
