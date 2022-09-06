import { StyleSheet } from 'react-native';
import React from 'react';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/baseComponents/Icon';
import images from '~/resources/images';
import useAuth from '~/hooks/auth';
import { formatDMLink, openUrl } from '~/utils/link';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../storeRedux/groups/keySelector';
import spacing, { borderRadius } from '~/theme/spacing';
import { Button } from '~/baseComponents';

interface MemberItemProps {
  item: any;
  canManageMember: boolean;
  onPressMenu: (item: any) => void;
}

const MemberItem = ({ item, canManageMember, onPressMenu }: MemberItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { user } = useAuth();
  const communityDetail = useKeySelector(groupsKeySelector.communityDetail);
  const { rootNavigation } = useRootNavigation();

  const {
    id, fullname, avatar, username,
  } = item || {};

  const goToUserProfile = () => {
    rootNavigation.navigate(
      mainStack.userProfile, { userId: id },
    );
  };

  const onPressChat = () => {
    if (!username) return;
    const link = formatDMLink(
      communityDetail.slug, username,
    );
    openUrl(link);
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
          <Text.BodyMMedium color={colors.neutral70} numberOfLines={1}>
            {fullname}
          </Text.BodyMMedium>
          <Text.BodyS color={colors.neutral40} numberOfLines={1}>{`@${username}`}</Text.BodyS>
        </>
      )}
      RightComponent={(
        <>
          {user?.username !== username && (
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
          {canManageMember && (
            <Button.Raise
              icon="menu"
              size="small"
              testID="member_item.icon_option.button"
              onPress={() => onPressMenu(item)}
            />
          )}
        </>
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
    marginHorizontal: spacing.margin.small,
    borderRadius: borderRadius.base,
  },
});

export default MemberItem;
