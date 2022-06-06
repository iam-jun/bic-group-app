import {StyleSheet} from 'react-native';
import React from 'react';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {ICommunityMembers} from '~/interfaces/ICommunity';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import {useTheme} from 'react-native-paper';
import images from '~/resources/images';
import useAuth from '~/hooks/auth';
import {formatDMLink} from '~/utils/link';
import {openLink} from '~/utils/common';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';

interface MemberItemProps {
  item: ICommunityMembers;
}

const MemberItem = ({item}: MemberItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {colors} = theme;
  const {user} = useAuth();
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);

  const {fullname, avatar, username} = item || {};

  const onPressChat = () => {
    const link = formatDMLink(infoDetail.slug, username);
    openLink(link);
  };

  return (
    <PrimaryItem
      showAvatar
      testID="member_item"
      style={styles.itemContainer}
      avatar={avatar || images.img_user_avatar_default}
      avatarProps={{isRounded: true, variant: 'medium'}}
      ContentComponent={
        <Text.Body numberOfLines={1}>
          {fullname}
          <Text.BodyS
            color={colors.textSecondary}>{` @${username}`}</Text.BodyS>
        </Text.Body>
      }
      RightComponent={
        user.username !== item.username && (
          <Icon
            icon={'CommentAltDots'}
            backgroundColor={colors.bgSecondary}
            style={styles.iconChat}
            onPress={onPressChat}
            buttonTestID="member_item.icon_chat.button"
          />
        )
      }
    />
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
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
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default MemberItem;
