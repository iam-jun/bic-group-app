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
import useAuth, {useUserIdAuth} from '~/hooks/auth';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import Icon from '~/beinComponents/Icon';
import {checkLastAdmin} from '../../helper';
import useLeaveGroup from '~/screens/Groups/GroupMembers/components/useLeaveGroup';

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
  const userId = useUserIdAuth();
  const {rootNavigation} = useRootNavigation();

  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const can_setting = useKeySelector(groupsKeySelector.groupDetail.can_setting);
  const isMember = join_status === groupJoinStatus.member;

  const alertLeaveGroup = useLeaveGroup({
    groupId: Number(groupId),
    username: user.username,
  });

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
    rootNavigation.navigate(groupStack.groupMembers, {groupId});
  };

  const onPressShareChat = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressNewFeature = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  const navigateToGroupAdmin = () => {
    dispatch(modalActions.hideModal());
    rootNavigation.navigate(groupStack.groupAdmin, {groupId});
  };

  return (
    <View style={[styles.container, style]}>
      {can_setting && (
        <PrimaryItem
          testID="group_header_menu.admin_tools"
          height={48}
          leftIconProps={{
            icon: 'iconShieldStar',
            size: 24,
            tintColor: theme.colors.primary6,
            style: styles.iconLeftStyle,
          }}
          leftIcon={'iconShieldStar'}
          title={t('groups:group_menu:label_admin_tools')}
          onPress={navigateToGroupAdmin}
          RightComponent={
            <Icon
              icon={'RightArrow'}
              size={12}
              tintColor={theme.colors.textSecondary}
            />
          }
        />
      )}
      <PrimaryItem
        testID="group_header_menu.copy_link"
        height={48}
        leftIconProps={{
          icon: 'Copy',
          size: 24,
          tintColor: theme.colors.primary6,
          style: styles.iconLeftStyle,
        }}
        leftIcon={'Link'}
        title={t('groups:group_menu:label_copy_group_link')}
        onPress={onPressCopyLink}
      />
      {!isWeb && (
        <PrimaryItem
          testID="group_header_menu.share_group"
          height={48}
          leftIconProps={{
            icon: 'ShareAlt',
            size: 24,
            tintColor: theme.colors.primary6,
            style: styles.iconLeftStyle,
          }}
          leftIcon={'ShareAlt'}
          title={t('groups:group_menu:label_share_group')}
          onPress={onPressShare}
        />
      )}
      {isWeb && (
        <PrimaryItem
          testID="group_header_menu.share_chat"
          height={48}
          leftIconProps={{
            icon: 'iconSend',
            size: 24,
            tintColor: theme.colors.primary6,
            style: styles.iconLeftStyle,
          }}
          leftIcon={'iconSend'}
          title={t('groups:group_menu:label_share_to_chat')}
          onPress={onPressShareChat}
        />
      )}
      <PrimaryItem
        testID="group_header_menu.following"
        height={48}
        leftIconProps={{
          icon: 'iconAddSquareDone',
          size: 24,
          tintColor: theme.colors.primary6,
          style: styles.iconLeftStyle,
        }}
        leftIcon={'iconAddSquareDone'}
        title={t('groups:group_menu:label_following')}
        onPress={onPressNewFeature}
      />
      <PrimaryItem
        testID="group_header_menu.pin_group"
        height={48}
        leftIconProps={{
          icon: 'iconMapPin',
          size: 24,
          tintColor: theme.colors.primary6,
          style: styles.iconLeftStyle,
        }}
        leftIcon={'iconMapPin'}
        title={t('groups:group_menu:label_pin_group')}
        onPress={onPressNewFeature}
      />
      <PrimaryItem
        testID="group_header_menu.notifications"
        height={48}
        leftIconProps={{
          icon: 'Bell',
          size: 24,
          tintColor: theme.colors.primary6,
          style: styles.iconLeftStyle,
        }}
        leftIcon={'Bell'}
        title={t('groups:group_menu:label_notifications')}
        onPress={onPressNewFeature}
      />
      {isMember && (
        <PrimaryItem
          testID="group_header_menu.leave_group"
          height={48}
          leftIconProps={{
            icon: 'SignOutAlt',
            size: 24,
            tintColor: theme.colors.error,
            style: styles.iconLeftStyle,
          }}
          leftIcon={'SignOutAlt'}
          title={t('groups:group_menu:label_leave_group')}
          titleProps={{color: theme.colors.error}}
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
    iconLeftStyle: {marginRight: spacing.margin.base},
  });
};

export default GroupHeaderMenu;
