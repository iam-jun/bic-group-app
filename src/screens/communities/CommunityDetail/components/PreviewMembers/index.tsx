import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Avatar from '~/baseComponents/Avatar';
import Text from '~/baseComponents/Text';

import { IPreviewMember } from '~/interfaces/ICommunity';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useRootNavigation } from '~/hooks/navigation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { Button } from '~/baseComponents';
import { useBaseHook } from '~/hooks';
import { formatLargeNumber } from '~/utils/formatter';
import { dimension } from '~/theme';
import { AvatarType } from '~/baseComponents/Avatar/AvatarComponent';
import { CONTAINER_HORIZONTAL_PADDING } from '../AboutContent';

interface Props {
  userCount: number;
  members: IPreviewMember[];
}

const ITEM_SPACING = 2;
const AVATAR_VARIANT = 'small' as AvatarType;

const PreviewMembers = ({ userCount, members }: Props) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();

  if (!members || members?.length === 0) {
    return null;
  }

  const numberOfAvatarsFitScreen = calculateNumberOfAvatarsFitScreen();
  const numberOfMembersToShow = members.length > numberOfAvatarsFitScreen
    ? numberOfAvatarsFitScreen - 1 // removed the last avatar to show moreAvatar item
    : numberOfAvatarsFitScreen;
  const membersDataToShow = members.slice(0, numberOfMembersToShow);

  const otherMembers = userCount - membersDataToShow.length;
  const otherMembersDisplay = otherMembers > 99 ? 99 : otherMembers;

  const onPressAvatar = (previewMember: IPreviewMember) => {
    rootNavigation.navigate(mainTabStack.userProfile, {
      userId: previewMember.id,
    });
  };

  const renderItem = ({ item }: { item: IPreviewMember }) => (
    <Button onPress={() => onPressAvatar(item)}>
      <Avatar variant={AVATAR_VARIANT} isRounded source={item.avatar} />
    </Button>
  );

  const renderMembersDescription = () => {
    let descriptionText: any = (
      <>
        {` ${t('post:and')} `}
        <Text.BodyMMedium>{t('communities:text_other_member', { count: formatLargeNumber(userCount - 1) })}</Text.BodyMMedium>
        {` ${t('communities:text_are_members')}`}
      </>
    );

    if (members?.length === 1) {
      descriptionText = ` ${t('communities:text_is_member')}`;
    }

    return (
      <Text.BodyM
        testID="preview_members.description"
        color={theme.colors.neutral40}
        style={styles.memberDescriptionText}
      >
        <Text.BodyMMedium>{members[0]?.fullname}</Text.BodyMMedium>
        {descriptionText}
      </Text.BodyM>
    );
  };

  const renderMoreAvatar = () => (
    <View>
      {!!otherMembersDisplay && (
        <Avatar
          variant={AVATAR_VARIANT}
          isRounded
          counter={otherMembersDisplay}
          style={styles.moreAvatar}
        />
      )}
    </View>
  );

  return (
    <>
      <FlatList
        testID="flatlist"
        horizontal
        data={membersDataToShow}
        renderItem={renderItem}
        style={styles.listStyle}
        scrollEnabled={false}
        initialNumToRender={15}
        ItemSeparatorComponent={() => <ViewSpacing width={ITEM_SPACING} />}
        ListFooterComponent={renderMoreAvatar}
        keyExtractor={(item, index) => `preview_members_${item}_${index}`}
      />
      {renderMembersDescription()}
    </>
  );
};

const styles = StyleSheet.create({
  listStyle: {
    marginVertical: spacing.margin.large,
  },
  memberDescriptionText: {
    marginTop: spacing.margin.xSmall,
  },
  moreAvatar: { marginLeft: ITEM_SPACING },
});

const calculateNumberOfAvatarsFitScreen = () => {
  const headTailHorizontalPadding = CONTAINER_HORIZONTAL_PADDING * 2;
  const avatarAndItemSeparatorWidth = dimension.avatarSizes[AVATAR_VARIANT] + ITEM_SPACING;

  const numberOfAvatarsFitScreen = Math.floor(
    (dimension.deviceWidth - headTailHorizontalPadding) / avatarAndItemSeparatorWidth,
  );

  return numberOfAvatarsFitScreen;
};

export default PreviewMembers;
