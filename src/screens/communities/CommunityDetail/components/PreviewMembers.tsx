import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Avatar from '~/baseComponents/Avatar';
import Text from '~/beinComponents/Text';
import ListView from '~/beinComponents/list/ListView';

import { IPreviewMember } from '~/interfaces/ICommunity';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useRootNavigation } from '~/hooks/navigation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { Button } from '~/baseComponents';
import { useBaseHook } from '~/hooks';
import { formatLargeNumber } from '~/utils/formatData';

interface Props {
  userCount: number;
  members: IPreviewMember[];
}

const PreviewMembers = ({ userCount, members }: Props) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();

  const otherMembers = userCount - (members?.length || 0);
  const otherMembersDisplay = otherMembers > 99 ? 99 : otherMembers;

  const onPressAvatar = (previewMember: IPreviewMember) => {
    rootNavigation.navigate(mainTabStack.userProfile, {
      userId: previewMember.id,
    });
  };

  const renderItem = ({ item }: { item: IPreviewMember }) => (
    <Button onPress={() => onPressAvatar(item)}>
      <Avatar.XSmall isRounded source={item.avatar} />
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

  if (!members || members?.length === 0) {
    return null;
  }

  return (
    <>
      <ListView
        horizontal
        data={members}
        renderItem={renderItem}
        listStyle={styles.listStyle}
        scrollEnabled={false}
        renderItemSeparator={() => <ViewSpacing width={2} />}
        ListFooterComponent={() => (
          <View>
            {!!otherMembersDisplay && (
              <Avatar.XSmall
                isRounded
                counter={otherMembersDisplay}
                style={{ marginLeft: 2 }}
              />
            )}
          </View>
        )}
      />
      {renderMembersDescription()}
    </>
  );
};

export default PreviewMembers;

const styles = StyleSheet.create({
  listStyle: {
    marginTop: spacing.margin.tiny,
  },
  memberDescriptionText: {
    marginTop: spacing.margin.small,
  },
});
