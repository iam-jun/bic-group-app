import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import modalActions, {clearToastMessage} from '~/store/modal/actions';
import i18next from 'i18next';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

interface PendingActionAllProps {
  groupId: number;
  style?: StyleProp<ViewStyle>;
}

const PendingActionAll = ({groupId, style}: PendingActionAllProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const groupDetail = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const totalPendingMembers = useKeySelector(
    groupsKeySelector.groupDetail.total_pending_members,
  );

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
        .t('groups:text_respond_all_member_requests:content:approve')
        .replace('{0}', totalPendingMembers)
        .replace('{1}', groupDetail?.name),
      doApproveAll,
    );
  };

  const doApproveAll = () => {
    dispatch(
      groupsActions.approveAllMemberRequests({
        groupId,
        callback: navigateToGroupMembers,
      }),
    );
  };

  const onPressDeclineAll = () => {
    alertAction(
      i18next.t('groups:text_respond_all_member_requests:title:decline'),
      i18next
        .t('groups:text_respond_all_member_requests:content:decline')
        .replace('{0}', totalPendingMembers),
      doDeclineAll,
    );
  };

  const doDeclineAll = () => {
    dispatch(groupsActions.declineAllMemberRequests(groupId));
  };

  return (
    <View style={[styles.container, style]}>
      <Divider />
      <View style={styles.buttons}>
        <Button.Secondary
          style={styles.buttonDecline}
          onPress={onPressDeclineAll}
          useI18n>
          common:btn_decline_all
        </Button.Secondary>
        <Button.Secondary
          highEmphasis
          style={styles.buttonApprove}
          color={theme.colors.primary6}
          onPress={onPressApproveAll}
          useI18n>
          common:btn_approve_all
        </Button.Secondary>
      </View>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      marginBottom: spacing.margin.large,
    },
    buttons: {
      flexDirection: 'row',
      margin: spacing.margin.large,
    },
    buttonDecline: {
      flex: 1,
      marginRight: spacing.margin.small,
    },
    buttonApprove: {
      flex: 1,
    },
  });
};

export default PendingActionAll;
