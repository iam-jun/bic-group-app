import React, {FC} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Share,
  Platform,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import {useBaseHook} from '~/hooks';
import modalActions, {
  showHideToastMessage,
  clearToastMessage,
} from '~/store/modal/actions';
import {getLink, LINK_GROUP} from '~/utils/link';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import groupJoinStatus from '~/constants/groupJoinStatus';
import groupsActions from '../../redux/actions';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import {IGroup} from '~/interfaces/IGroup';
import useAuth from '~/hooks/auth';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

export interface GroupHeaderMenuProps {
  style?: StyleProp<ViewStyle>;
  groupId: string;
}

const GroupHeaderMenu: FC<GroupHeaderMenuProps> = ({
  style,
  groupId,
}: GroupHeaderMenuProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const {user} = useAuth();
  const {rootNavigation} = useRootNavigation();

  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const can_setting = useKeySelector(groupsKeySelector.groupDetail.can_setting);
  const isMember = join_status === groupJoinStatus.member;

  const isWeb = Platform.OS === 'web';

  const onPressCopyLink = () => {
    dispatch(modalActions.hideModal());
    Clipboard.setString(getLink(LINK_GROUP, groupId));
    dispatch(
      showHideToastMessage({
        content: 'common:text_link_copied_to_clipboard',
        props: {
          textProps: {useI18n: true},
          type: 'success',
        },
      }),
    );
  };

  const onPressShare = () => {
    dispatch(modalActions.hideModal());
    const groupLink = getLink(LINK_GROUP, groupId);
    try {
      Share.share({
        message: groupLink,
        url: groupLink,
      }).then(result => {
        console.log(`\x1b[35m🐣️ Share group result: `, result, `\x1b[0m`);
      });
    } catch (error) {
      console.log(`\x1b[31m🐣️ Share group error: ${error}\x1b[0m`);
    }
  };

  const onPressLeave = () => {
    dispatch(modalActions.hideModal());

    // check if the current user is admin or member
    if (can_setting) return checkLastAdmin();
    alertLeaveGroup();
  };

  const navigateToMembers = () => {
    dispatch(clearToastMessage());
    rootNavigation.navigate(groupStack.groupMembers, {groupId});
  };

  const checkLastAdmin = () => {
    groupsDataHelper
      .getGroupMembers(Number(groupId), {offset: 0, limit: 1})
      .then(data => {
        const adminCount = data?.GROUP_ADMIN?.user_count;
        if (adminCount > 1) {
          alertLeaveGroup();
        } else {
          dispatch(
            modalActions.showHideToastMessage({
              content: 'groups:error:last_admin_leave',
              props: {
                type: 'error',
                textProps: {useI18n: true},
                rightIcon: 'UsersAlt',
                rightText: 'Members',
                onPressRight: navigateToMembers,
              },
              toastType: 'normal',
            }),
          );
        }
      })
      .catch(err => {
        console.log('[ERROR] error while fetching group members', err);
        dispatch(
          modalActions.showHideToastMessage({
            content: 'error:http:unknown',
            props: {textProps: {useI18n: true}, type: 'error'},
          }),
        );
      });
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

    // Handling leaving other inner groups
    groupsDataHelper
      .getUserInnerGroups(Number(groupId), user.username)
      .then(res => {
        const innerGroups = res.data.inner_groups.map(
          (group: IGroup) => group.name,
        );
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
      })
      .catch(err => {
        console.log('[ERROR] error while fetching user inner groups', err);
        dispatch(
          modalActions.showHideToastMessage({
            content: 'error:http:unknown',
            props: {textProps: {useI18n: true}, type: 'error'},
          }),
        );
      });
  };

  const doLeaveGroup = () => {
    dispatch(groupsActions.leaveGroup(Number(groupId)));
  };

  const onPressShareChat = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  return (
    <View style={[styles.container, style]}>
      <PrimaryItem
        testID="group_header_menu.copy_link"
        height={48}
        leftIconProps={{icon: 'Link', size: 24}}
        leftIcon={'Link'}
        title={t('groups:group_menu:label_copy_group_link')}
        onPress={onPressCopyLink}
      />
      {!isWeb && (
        <PrimaryItem
          testID="group_header_menu.share_group"
          height={48}
          leftIconProps={{icon: 'ShareAlt', size: 24}}
          leftIcon={'ShareAlt'}
          title={t('groups:group_menu:label_share_group')}
          onPress={onPressShare}
        />
      )}
      {isWeb && (
        <PrimaryItem
          testID="group_header_menu.share_chat"
          height={48}
          leftIconProps={{icon: 'iconSend', size: 24}}
          leftIcon={'iconSend'}
          title={t('groups:group_menu:label_share_to_chat')}
          onPress={onPressShareChat}
        />
      )}
      {isMember && (
        <PrimaryItem
          testID="group_header_menu.leave_group"
          height={48}
          leftIconProps={{icon: 'SignOutAlt', size: 24}}
          leftIcon={'SignOutAlt'}
          title={t('groups:group_menu:label_leave_group')}
          onPress={onPressLeave}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
    item: {
      height: 44,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default GroupHeaderMenu;
