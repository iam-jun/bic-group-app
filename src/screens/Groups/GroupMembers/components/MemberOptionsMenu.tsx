import React from 'react';
import {View, StyleSheet} from 'react-native';
import i18next from 'i18next';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import BottomSheet from '~/beinComponents/BottomSheet';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';

import {IGroup, IGroupMemberRole, IGroupMembers} from '~/interfaces/IGroup';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import {ITheme} from '~/theme/interfaces';
import useAuth from '~/hooks/auth';
import modalActions from '~/store/modal/actions';
import mainStack from '~/router/navigator/MainStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import groupsActions from '../../redux/actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';

interface MemberOptionsMenuProps {
  groupId: number;
  modalizeRef: any;
  selectedMember?: IGroupMembers;
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
  const {rootNavigation} = useRootNavigation();

  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );
  const can_setting = useKeySelector(groupsKeySelector.groupDetail.can_setting);

  const onPressMenuOption = (
    type:
      | 'view-profile'
      | 'send-message'
      | 'set-admin'
      | 'remove-admin'
      | 'remove-member'
      | 'leave-group',
  ) => {
    modalizeRef.current?.close();
    switch (type) {
      case 'view-profile':
        goToUserProfile(selectedMember);
        break;
      case 'set-admin':
        alertSettingAdmin(selectedMember);
        break;
      case 'remove-admin':
        onPressRemoveAdmin(selectedMember);
        break;
      case 'remove-member':
        alertRemovingMember(selectedMember);
        break;
      case 'leave-group':
        onPressLeave();
        break;
      default:
        dispatch(modalActions.showAlertNewFeature());
        break;
    }
  };

  const goToUserProfile = (selectedMember?: IGroupMembers) => {
    if (selectedMember) {
      rootNavigation.navigate(mainStack.userProfile, {
        userId: selectedMember.id,
      });
    }
  };

  const alertSettingAdmin = (selectedMember?: IGroupMembers) => {
    if (selectedMember) {
      const alertPayload = {
        iconName: 'Star',
        title: i18next.t('groups:modal_confirm_set_admin:title'),
        content: i18next.t('groups:modal_confirm_set_admin:description'),
        ContentComponent: Text.BodyS,
        cancelBtn: true,
        cancelBtnProps: {
          textColor: theme.colors.primary7,
          testID: 'member_options_menu.set_admin.cancel',
        },
        onConfirm: () => doSetAdmin(selectedMember),
        confirmLabel: i18next.t(
          'groups:modal_confirm_set_admin:button_confirm',
        ),
        ConfirmBtnComponent: Button.Secondary,
        confirmBtnProps: {
          highEmphasis: true,
          testID: 'member_options_menu.set_admin.confirm',
        },
      };
      alertPayload.content = alertPayload.content.replace(
        '{0}',
        `"${selectedMember?.fullname}"`,
      );
      dispatch(modalActions.showAlert(alertPayload));
    }
  };

  const doSetAdmin = (selectedMember: IGroupMembers) => {
    dispatch(
      groupsActions.setGroupAdmin({groupId, userIds: [selectedMember.id]}),
    );
  };

  const onPressRemoveAdmin = (selectedMember?: IGroupMembers) => {
    if (selectedMember) {
      // check if the current user is the last admin before revoking admin
      if (can_setting)
        return checkLastAdmin('remove', () =>
          alertRemovingAdmin(selectedMember),
        );
      alertRemovingAdmin(selectedMember);
    }
  };

  const alertRemovingAdmin = (selectedMember: IGroupMembers) => {
    const alertPayload = {
      iconName: 'StarHalfAlt',
      title: i18next.t('groups:modal_confirm_remove_admin:title'),
      content: i18next.t('groups:modal_confirm_remove_admin:description'),
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      cancelBtnProps: {
        textColor: theme.colors.primary7,
        testID: 'member_options_menu.remove_admin.cancel',
      },
      onConfirm: () => doRemoveAdmin(selectedMember),
      confirmLabel: i18next.t(
        'groups:modal_confirm_remove_admin:button_confirm',
      ),
      confirmBtnProps: {
        testID: 'member_options_menu.remove_admin.confirm',
      },
      ConfirmBtnComponent: Button.Danger,
    };
    alertPayload.content = alertPayload.content.replace(
      '{0}',
      `"${selectedMember?.fullname}"`,
    );
    dispatch(modalActions.showAlert(alertPayload));
  };

  const doRemoveAdmin = (selectedMember: IGroupMembers) => {
    dispatch(
      groupsActions.removeGroupAdmin({groupId, userId: selectedMember?.id}),
    );
  };

  const onPressMemberButton = () => {
    dispatch(modalActions.clearToastMessage());
  };

  const checkLastAdmin = (type: string, callback: () => void) => {
    groupsDataHelper
      .getGroupMembers(groupId, {offset: 0, limit: 1})
      .then(data => {
        const adminCount = data?.GROUP_ADMIN?.user_count;
        if (adminCount > 1) {
          callback();
        } else {
          dispatch(
            modalActions.showHideToastMessage({
              content: `groups:error:last_admin_${type}`,
              props: {
                type: 'error',
                textProps: {useI18n: true},
                rightIcon: 'UsersAlt',
                rightText: 'Members',
                onPressRight: onPressMemberButton,
              },
              toastType: 'normal',
            }),
          );
        }
      })
      .catch(err => {
        console.error('[ERROR] error while fetching group members', err);
        dispatch(
          modalActions.showHideToastMessage({
            content: 'error:http:unknown',
            props: {textProps: {useI18n: true}, type: 'error'},
          }),
        );
      });
  };

  const alertRemovingMember = (selectedMember?: IGroupMembers) => {
    if (!selectedMember) {
      dispatch(
        modalActions.showHideToastMessage({
          content: 'No member selected',
          props: {type: 'error'},
        }),
      );
      return;
    }

    const {id: userId, fullname, username} = selectedMember;

    const content = i18next
      .t(`groups:modal_confirm_remove_member:final_alert`)
      .replace('{name}', `"${fullname}"`);

    const alertPayload = {
      iconName: 'RemoveUser',
      title: i18next.t('groups:modal_confirm_remove_member:title'),
      content: content,
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      cancelBtnProps: {
        textColor: theme.colors.primary7,
        testID: 'member_options_menu.remove_member.cancel',
      },
      onConfirm: () => removeMember(userId, fullname),
      confirmLabel: i18next.t(
        'groups:modal_confirm_remove_member:button_remove',
      ),
      confirmBtnProps: {
        testID: 'member_options_menu.remove_member.confirm',
      },
      ConfirmBtnComponent: Button.Danger,
      children: null as React.ReactNode,
    };

    const renderAlertInnerGroups = (innerGroups: string[]) => {
      if (innerGroups.length === 0) return null;

      const count = innerGroups.length;
      let message = i18next
        .t('groups:modal_confirm_remove_member:alert_inner_groups')
        .replace('{0}', `${count}`);

      if (count === 1)
        message = message.replace(
          '1 other inner groups',
          'another inner group',
        );

      const first3groups = innerGroups.slice(0, 3);
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

    const getInnerGroupsNames = (innerGroups: any) => {
      const groupsRemovedFrom = [...innerGroups];

      if (groupsRemovedFrom.length === 0) {
        alertPayload.content = alertPayload.content.replace(
          '{other groups}',
          '',
        );
      } else {
        const otherGroups = groupsRemovedFromToString(groupsRemovedFrom);
        alertPayload.content = alertPayload.content.replace(
          '{other groups}',
          ` and ${otherGroups}`,
        );
        alertPayload.children = renderAlertInnerGroups(innerGroups);
      }

      dispatch(modalActions.showAlert(alertPayload));
    };

    handleLeaveInnerGroups(username, getInnerGroupsNames);
  };

  const removeMember = (userId: number, userFullname: string) => {
    dispatch(groupsActions.removeMember({groupId, userId, userFullname}));
  };

  const groupsRemovedFromToString = (groupList: string[]) => {
    if (groupList.length === 1) {
      return groupList[0];
    }

    return `${groupList.length} other inner groups: ${groupList.join(', ')}`;
  };

  const handleLeaveInnerGroups = (
    username: string,
    callback: (innerGroups: any) => void,
  ) => {
    // Get inner groups info (if any) when user leave/being removed from a group
    groupsDataHelper
      .getUserInnerGroups(groupId, username)
      .then(res => {
        const innerGroups = res.data.inner_groups.map(
          (group: IGroup) => group.name,
        );
        callback(innerGroups);
      })
      .catch(err => {
        console.error('Error while fetching user inner groups', err);
        dispatch(
          modalActions.showHideToastMessage({
            content: 'error:http:unknown',
            props: {textProps: {useI18n: true}, type: 'error'},
          }),
        );
      });
  };

  const onPressLeave = () => {
    // check if the current user is the last admin before leaving group
    if (can_setting) return checkLastAdmin('leave', alertLeaveGroup);
    alertLeaveGroup();
  };

  const alertLeaveGroup = () => {
    const alertPayload = {
      iconName: 'SignOutAlt',
      title: i18next.t('groups:modal_confirm_leave_group:title'),
      content: i18next.t('groups:modal_confirm_leave_group:description'),
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      cancelBtnProps: {
        textColor: theme.colors.primary7,
      },
      onConfirm: () => doLeaveGroup(),
      confirmLabel: i18next.t('groups:modal_confirm_leave_group:button_leave'),
      ConfirmBtnComponent: Button.Danger,
    };

    const getInnerGroupsNames = (innerGroups: any) => {
      if (innerGroups.length > 0) {
        alertPayload.content =
          alertPayload.content +
          ` ${i18next.t(
            'groups:modal_confirm_leave_group:leave_inner_groups',
          )}`;

        const groupsLeaveToString = innerGroups.join(', ');
        alertPayload.content = alertPayload.content.replace(
          '{0}',
          groupsLeaveToString,
        );
      }

      dispatch(modalActions.showAlert(alertPayload));
    };

    handleLeaveInnerGroups(user.username, getInnerGroupsNames);
  };

  const doLeaveGroup = () => {
    dispatch(groupsActions.leaveGroup(groupId));
  };

  const isGroupAdmin = () => {
    return !!selectedMember?.roles?.find(
      (role: IGroupMemberRole) => role.type === 'GROUP_ADMIN',
    );
  };

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      onClosed={onOptionsClosed}
      ContentComponent={
        <View style={styles.bottomSheet}>
          <PrimaryItem
            testID="member_options_menu.view_profile"
            style={styles.menuOption}
            leftIcon={'UsersAlt'}
            leftIconProps={{icon: 'UsersAlt', size: 24}}
            title={i18next.t('groups:member_menu:label_view_profile')}
            onPress={() => onPressMenuOption('view-profile')}
          />
          {selectedMember?.username !== user?.username && (
            <PrimaryItem
              testID="member_options_menu.send_message"
              style={styles.menuOption}
              leftIcon={'iconSend'}
              leftIconProps={{icon: 'iconSend', size: 24}}
              title={i18next.t('groups:member_menu:label_send_message')}
              onPress={() => onPressMenuOption('send-message')}
            />
          )}
          {can_setting &&
            (isGroupAdmin() ? (
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
