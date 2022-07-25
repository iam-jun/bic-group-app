import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import groupJoinStatus from '~/constants/groupJoinStatus';
import useAuth, { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import modalActions, {
  clearToastMessage,
  showHideToastMessage,
} from '~/store/modal/actions';
import spacing from '~/theme/spacing';
import { openLink } from '~/utils/common';
import { formatChannelLink, getLink, LINK_GROUP } from '~/utils/link';
import HeaderMenu from '../../components/HeaderMenu';
import useLeaveGroup from '../../GroupMembers/components/useLeaveGroup';
import { checkLastAdmin } from '../../helper';
import groupsKeySelector from '../../redux/keySelector';
import { useMyPermissions } from '~/hooks/permissions';

const GroupTopBar = () => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { rootNavigation } = useRootNavigation();

  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const isMember = join_status === groupJoinStatus.member;
  const { id: groupId, chat_id: chatId } = groupInfo || {};
  const { user } = useAuth();
  const userId = useUserIdAuth();

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canSetting = hasPermissionsOnScopeWithId('groups', groupId, [
    PERMISSION_KEY.GROUP.APPROVE_REJECT_JOINING_REQUESTS,
    PERMISSION_KEY.GROUP.EDIT_INFORMATION,
    PERMISSION_KEY.GROUP.EDIT_PRIVACY,
  ]);

  const count = useKeySelector(
    `chat.unreadChannels.${chatId}.mention_count_root`,
  );

  const alertLeaveGroup = useLeaveGroup({
    groupId,
    username: user.username,
  });

  const onPressBack = () => {
    rootNavigation.goBack();
  };

  const onPressAdminTools = () => {
    dispatch(modalActions.hideModal());
    rootNavigation.navigate(groupStack.groupAdmin, { groupId });
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideModal());
    Clipboard.setString(getLink(LINK_GROUP, groupId));
    dispatch(
      showHideToastMessage({
        content: 'common:text_link_copied_to_clipboard',
        props: {
          textProps: { useI18n: true },
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
      }).then((result) => {
        console.log('\x1b[35m🐣️ Share group result: ', result, '\x1b[0m');
      });
    } catch (error) {
      console.log(`\x1b[31m🐣️ Share group error: ${error}\x1b[0m`);
    }
  };

  const onPressLeave = () => {
    dispatch(modalActions.hideModal());

    return checkLastAdmin(
      groupId,
      userId,
      dispatch,
      alertLeaveGroup,
      navigateToMembers,
    );
  };

  const navigateToMembers = () => {
    dispatch(clearToastMessage());
    rootNavigation.navigate(groupStack.groupMembers, { groupId });
  };

  const onPressMenu = () => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: (
          <HeaderMenu
            type="group"
            isMember={isMember}
            canSetting={canSetting}
            onPressAdminTools={onPressAdminTools}
            onPressCopyLink={onPressCopyLink}
            onPressShare={onPressShare}
            onPressLeave={onPressLeave}
          />
        ),
        props: {
          isContextMenu: true,
          menuMinWidth: 280,
          modalStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
        },
      }),
    );
  };

  const onPressChat = () => {
    const link = formatChannelLink(groupInfo.team_name, groupInfo.slug);
    openLink(link);
  };

  const onPressSearch = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  // only admin can see this button
  const renderAdminButton = () => (
    <ButtonWrapper onPress={onPressMenu} testID="group_top_bar.admin_button">
      <Icon icon="iconShieldStar" fill={theme.colors.neutral80} size={24} />
    </ButtonWrapper>
  );

  // only members can see this icon
  const renderSearchIcon = () => (
    isMember && (
    <ButtonWrapper onPress={onPressSearch} testID="group_top_bar.search">
      <Icon
        icon="iconSearch"
        size={22}
        style={styles.iconSearch}
        tintColor={theme.colors.neutral80}
      />
    </ButtonWrapper>
    )
  );
  const renderGroupOption = () => (
    <ButtonWrapper onPress={onPressMenu} testID="group_top_bar.option_menu">
      <Icon icon="menu" tintColor={theme.colors.neutral80} />
    </ButtonWrapper>
  );

  const renderChatIcon = () => (
    <ButtonWrapper onPress={onPressChat} testID="group_top_bar.chat">
      <Icon
        icon="iconChat"
        size={24}
        tintColor={theme.colors.neutral80}
        style={styles.iconShieldStar}
      />
      <NotificationsBadge.Alert
        style={styles.badge}
        number={count}
        maxNumber={99}
      />
    </ButtonWrapper>
  );

  return (
    <View style={styles.container} testID="group_top_bar">
      <View style={styles.leftComponent}>
        <Icon
          buttonTestID="group_top_bar.back"
          icon="iconBack"
          size={28}
          hitSlop={{
            top: 20, bottom: 20, left: 20, right: 20,
          }}
          onPress={onPressBack}
        />
      </View>
      <View style={styles.rightComponent}>
        {renderSearchIcon()}
        {renderChatIcon()}
        {canSetting ? renderAdminButton() : renderGroupOption()}
      </View>
    </View>
  );
};

export default GroupTopBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.margin.large,
    marginVertical: spacing.margin.small,
  },
  leftComponent: {
    flexDirection: 'row',
  },
  rightComponent: {
    flexDirection: 'row',
  },
  iconShieldStar: {
    marginRight: spacing.margin.extraLarge,
  },
  iconSearch: {
    marginRight: spacing.margin.extraLarge,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: 10,
  },
});
