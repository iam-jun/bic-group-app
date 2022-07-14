import {StyleSheet} from 'react-native';
import React from 'react';

import Text from '~/beinComponents/Text';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import images from '~/resources/images';
import useAuth from '~/hooks/auth';
import {formatDMLink} from '~/utils/link';
import {openLink} from '~/utils/common';
import {useRootNavigation} from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import spacing from '~/theme/spacing';

interface MemberItemProps {
  item: any;
  canManageMember: boolean;
  onPressMenu: (item: any) => void;
}

const MemberItem = ({item, canManageMember, onPressMenu}: MemberItemProps) => {
  const theme = useTheme() as ExtendedTheme;
  const {colors} = theme;
  const {user} = useAuth();
  const communityDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {rootNavigation} = useRootNavigation();

  const {id, fullname, avatar, username} = item || {};

  const goToUserProfile = () => {
    rootNavigation.navigate(mainStack.userProfile, {userId: id});
  };

  const onPressChat = () => {
    if (!username) return;
    const link = formatDMLink(communityDetail.slug, username);
    openLink(link);
  };

  return (
    <PrimaryItem
      showAvatar
      testID="member_item"
      style={styles.itemContainer}
      avatar={avatar || images.img_user_avatar_default}
      avatarProps={{isRounded: true, variant: 'medium'}}
      onPress={goToUserProfile}
      ContentComponent={
        <Text.BodyM numberOfLines={1}>
          {fullname}
          <Text.BodyS color={colors.gray50}>{` @${username}`}</Text.BodyS>
        </Text.BodyM>
      }
      RightComponent={
        <>
          {user?.username !== username && (
            <Icon
              icon={'MessageDots'}
              backgroundColor={colors.neutral1}
              style={styles.iconChat}
              onPress={onPressChat}
              buttonTestID="member_item.icon_chat.button"
            />
          )}
          {canManageMember && (
            <Icon
              icon={'menu'}
              style={styles.iconOption}
              onPress={() => onPressMenu(item)}
              buttonTestID="member_item.icon_option.button"
            />
          )}
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: undefined,
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.tiny,
  },
  iconChat: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.padding.small,
    marginLeft: spacing.margin.tiny,
  },
  iconOption: {
    marginLeft: spacing.margin.small,
  },
});

export default MemberItem;
