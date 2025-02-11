import React, { useCallback } from 'react';
import {
  StyleSheet, Keyboard, View,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/baseComponents/Icon';
import images from '~/resources/images';
import useAuthController, { IAuthState } from '~/screens/auth/store';
import { formatDMLink, openUrl } from '~/utils/link';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import spacing, { borderRadius } from '~/theme/spacing';
import { Button } from '~/baseComponents';
import { useBaseHook } from '~/hooks';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import { IGroupMembers } from '~/interfaces/IGroup';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import useBlockingStore from '~/store/blocking';
import VerifiedView from '~/components/VerifiedView';

interface MemberItemProps {
  item: ICommunityMembers | IGroupMembers;
  isAdminRole: boolean;
  canManageMember: boolean;
  communityId: string;
  onPressMenu: (item: any) => void;
}

const MemberItem = ({
  item, isAdminRole, canManageMember, communityId, onPressMenu,
}: MemberItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const user = useAuthController(useCallback((state: IAuthState) => state.authUser, []));
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const community = useCommunitiesStore((state: ICommunitiesState) => state.data[communityId]);

  const { listRelationship } = useBlockingStore();
  const isBlockedUser = listRelationship.some((userId) => userId === item.id);

  const {
    id, fullname, avatar, username, isVerified,
  } = item || {};

  const isMe = user?.username === username;
  const memberName = isMe ? `${fullname} (${t('common:text_you')})` : fullname;

  /**
   * Community owner/admins or Group admins can send message to all members
   * Members cannot send message to other members, except group admins.
   */
  const canSendMessage = !isMe && (isAdminRole || !!item?.isAdmin) && !isBlockedUser;

  const goToUserProfile = () => {
    Keyboard.dismiss();
    rootNavigation.navigate(
      mainStack.userProfile, { userId: id },
    );
  };

  const onPressChat = () => {
    Keyboard.dismiss();
    if (!username) return;
    const link = formatDMLink(community?.slug, username);
    openUrl(link);
  };

  const _onPressMenu = () => {
    Keyboard.dismiss();
    onPressMenu(item);
  };

  const renderButtonMenu = () => {
    if (!canManageMember && isMe) return null;

    return (
      <Button.Raise
        style={styles.iconMenu}
        icon="menu"
        size="small"
        testID="member_item.icon_option.button"
        onPress={_onPressMenu}
      />
    );
  };

  return (
    <PrimaryItem
      showAvatar
      testID="member_item"
      style={styles.itemContainer}
      avatar={avatar || images.img_user_avatar_default}
      avatarProps={{ isRounded: true, variant: 'small' }}
      onPress={goToUserProfile}
      ContentComponent={(
        <>
          <View style={styles.row}>
            <Text.BodyMMedium
              testID="member_item.name"
              ellipsizeMode="middle"
              color={colors.neutral60}
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            >
              {memberName}
            </Text.BodyMMedium>
            <VerifiedView size={12} isVerified={isVerified} />
          </View>
          <Text.BodyS
            testID="member_item.username"
            color={colors.neutral30}
            numberOfLines={1}
          >
            {`@${username}`}
          </Text.BodyS>
        </>
      )}
      RightComponent={(
        <View style={styles.row}>
          {canSendMessage && (
            <Icon
              icon="CommentDotsSolid"
              size={15}
              backgroundColor={colors.blue2}
              tintColor={colors.blue50}
              style={styles.iconChat}
              onPress={onPressChat}
              buttonTestID="member_item.icon_chat.button"
            />
          )}
          {renderButtonMenu()}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.tiny,
  },
  iconChat: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.padding.xSmall,
    marginLeft: spacing.margin.small,
    borderRadius: borderRadius.base,
  },
  iconMenu: {
    marginLeft: spacing.margin.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
});

export default MemberItem;
