import React from 'react';
import {View, StyleSheet} from 'react-native';
import i18next from 'i18next';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import BottomSheet from '~/beinComponents/BottomSheet';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';

import {IGroupMembers} from '~/interfaces/IGroup';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import {ITheme} from '~/theme/interfaces';
import useAuth from '~/hooks/auth';
import modalActions from '~/store/modal/actions';
import groupsActions from '../../redux/actions';
import {checkLastAdmin, handleLeaveInnerGroups} from '../../helper';
import useRemoveMember from './useRemoveMember';
import useRemoveAdmin from './useRemoveAdmin';
import useLeaveGroup from './useLeaveGroup';

interface MemberOptionsMenuProps {
  groupId: number;
  modalizeRef: any;
  selectedMember: IGroupMembers;
  onOptionsClosed: () => void;
}

const MemberOptionsMenu = ({
  groupId,
  modalizeRef,
  selectedMember,
  onOptionsClosed,
}: MemberOptionsMenuProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const dispatch = useDispatch();
  const {user} = useAuth();

  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );
  const can_setting = useKeySelector(groupsKeySelector.groupDetail.can_setting);
  const groupMembers = useKeySelector(groupsKeySelector.groupMembers);
  const {getInnerGroupsNames} = useRemoveMember({
    groupId,
    selectedMember,
  });
  const alertRemovingAdmin = useRemoveAdmin({groupId, selectedMember});
  const alertLeaveGroup = useLeaveGroup({groupId, username: user?.username});

  const onPressMenuOption = (
    type: 'set-admin' | 'remove-admin' | 'remove-member' | 'leave-group',
  ) => {
    modalizeRef.current?.close();
    switch (type) {
      case 'set-admin':
        alertSettingAdmin();
        break;
      case 'remove-admin':
        onPressRemoveAdmin();
        break;
      case 'remove-member':
        onPressRemoveMember();
        break;
      case 'leave-group':
        onPressLeave();
        break;
      default:
        dispatch(modalActions.showAlertNewFeature());
        break;
    }
  };

  const alertSettingAdmin = () => {
    const alertPayload = {
      iconName: 'Star',
      title: i18next.t('groups:modal_confirm_set_admin:title'),
      content: i18next.t('groups:modal_confirm_set_admin:description'),
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      cancelBtnProps: {
        textColor: theme.colors.primary7,
      },
      onConfirm: doSetAdmin,
      confirmLabel: i18next.t('groups:modal_confirm_set_admin:button_confirm'),
      ConfirmBtnComponent: Button.Secondary,
      confirmBtnProps: {
        highEmphasis: true,
      },
    };
    alertPayload.content = alertPayload.content.replace(
      '{0}',
      `"${selectedMember?.fullname}"`,
    );
    dispatch(modalActions.showAlert(alertPayload));
  };

  const doSetAdmin = () => {
    selectedMember?.id &&
      dispatch(
        groupsActions.setGroupAdmin({groupId, userIds: [selectedMember.id]}),
      );
  };

  const onPressRemoveAdmin = () => {
    if (selectedMember?.id) {
      const adminCount = groupMembers?.group_admin?.user_count;
      if (adminCount > 1) {
        alertRemovingAdmin();
      } else {
        dispatch(
          modalActions.showHideToastMessage({
            content: 'groups:error:last_admin_remove',
            props: {
              type: 'error',
              textProps: {useI18n: true},
              rightIcon: 'UserGroup',
              rightText: 'Members',
              onPressRight: onPressMemberButton,
            },
            toastType: 'normal',
          }),
        );
      }
    }
  };

  const onPressMemberButton = () => {
    dispatch(modalActions.clearToastMessage());
  };

  const onPressRemoveMember = () => {
    if (selectedMember?.id)
      return checkLastAdmin(
        groupId,
        selectedMember.id,
        dispatch,
        () => alertRemovingMember(selectedMember),
        onPressMemberButton,
        'remove',
      );
  };

  const alertRemovingMember = (selectedMember: IGroupMembers) => {
    selectedMember?.username &&
      handleLeaveInnerGroups(
        groupId,
        selectedMember.username,
        dispatch,
        getAlertPayloadWithInnerGroups,
      );
  };

  const getAlertPayloadWithInnerGroups = (innerGroups: any) => {
    getInnerGroupsNames(innerGroups, renderInnerGroupsAlert);
  };

  const renderInnerGroupsAlert = (message: string, innerGroups: string[]) => {
    const first3groups = innerGroups.slice(0, 3);
    const count = innerGroups.length;

    const groupsList = () => (
      <View style={styles.alertRemoveGroupsList}>
        {first3groups.map((name, index) => (
          <Text.BodyM key={index} style={styles.alertRemoveGroupsListItem}>
            • {name}
          </Text.BodyM>
        ))}
        {count > 3 && <Text.BodyS>...</Text.BodyS>}
      </View>
    );

    return (
      <>
        <Text.BodyS>{message}</Text.BodyS>
        {groupsList()}
      </>
    );
  };

  const onPressLeave = () => {
    // check if the current user is the last admin before leaving group
    if (selectedMember?.id) {
      return checkLastAdmin(
        groupId,
        selectedMember.id,
        dispatch,
        alertLeaveGroup,
        onPressMemberButton,
      );
    }
  };

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      onClose={onOptionsClosed}
      ContentComponent={
        <View style={styles.bottomSheet}>
          {can_setting &&
            (selectedMember?.is_admin ? (
              <PrimaryItem
                testID="member_options_menu.remove_admin"
                style={styles.menuOption}
                leftIcon={'Star'}
                leftIconProps={{icon: 'Star', size: 24}}
                title={i18next.t('groups:member_menu:label_remove_as_admin')}
                onPress={() => onPressMenuOption('remove-admin')}
              />
            ) : (
              <PrimaryItem
                testID="member_options_menu.set_admin"
                style={styles.menuOption}
                leftIcon={'Star'}
                leftIconProps={{icon: 'Star', size: 24}}
                title={i18next.t('groups:member_menu:label_set_as_admin')}
                onPress={() => onPressMenuOption('set-admin')}
              />
            ))}
          {can_manage_member && selectedMember?.username !== user?.username && (
            <PrimaryItem
              testID="member_options_menu.remove_member"
              style={styles.menuOption}
              leftIcon={'UserTimes'}
              leftIconProps={{
                icon: 'UserTimes',
                size: 24,
                tintColor: theme.colors.error,
              }}
              title={i18next.t('groups:member_menu:label_remove_member')}
              titleProps={{color: theme.colors.error}}
              onPress={() => onPressMenuOption('remove-member')}
            />
          )}
          {selectedMember?.username === user?.username && (
            <PrimaryItem
              testID="member_options_menu.leave_group"
              style={styles.menuOption}
              leftIcon={'SignOutAlt'}
              leftIconProps={{icon: 'SignOutAlt', size: 24}}
              title={i18next.t('groups:member_menu:label_leave_group')}
              onPress={() => onPressMenuOption('leave-group')}
            />
          )}
        </View>
      }
    />
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    bottomSheet: {
      paddingVertical: spacing.padding.tiny,
    },
    menuOption: {
      height: 44,
      paddingHorizontal: spacing.padding.large,
    },
    alertRemoveGroupsList: {
      marginBottom: spacing.margin.small,
    },
    alertRemoveGroupsListItem: {
      marginLeft: spacing.margin.small,
    },
  });
};

export default MemberOptionsMenu;
