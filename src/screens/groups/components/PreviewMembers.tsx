import { StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import i18next from 'i18next';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../storeRedux/groups/keySelector';
import Avatar from '~/baseComponents/Avatar';
import Text from '~/beinComponents/Text';
import ListView from '~/beinComponents/list/ListView';

import { IPreviewMember } from '~/interfaces/ICommunity';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useRootNavigation } from '~/hooks/navigation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { Button } from '~/baseComponents';

const PreviewMembers = () => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const { userCount, members } = infoDetail;
  const otherMembers = userCount - (members?.length || 0);

  const onPressAvatar = (previewMember: IPreviewMember) => {
    rootNavigation.navigate(mainTabStack.userProfile, {
      userId: previewMember.id,
    });
  };

  const renderItem = ({ item }: { item: IPreviewMember }) => (
    <Button onPress={() => onPressAvatar(item)}>
      <Avatar.XSmall
        isRounded
        source={item.avatar}
      />
    </Button>
  );

  const renderMembersDescription = () => {
    let memberText: string;
    if (members?.length === 1) {
      memberText = `${members[0]?.fullname} ${i18next.t(
        'communities:text_is_member',
      )}`;
    } else {
      memberText = `${members[0]?.fullname} ${i18next.t(
        'post:and',
      )} ${i18next.t('communities:text_other_member', {
        count: userCount - 1,
      })}`;
    }

    return (
      <Text.BodyM
        testID="preview_members.description"
        color={theme.colors.neutral40}
        style={styles.memberDescriptionText}
      >
        {memberText}
      </Text.BodyM>
    );
  };

  if (!members) {
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
        renderItemSeparator={() => <ViewSpacing width={spacing.margin.tiny} />}
        ListFooterComponent={() => (
          <Avatar.XSmall
            isRounded
            counter={otherMembers}
            style={{ marginLeft: spacing.margin.tiny }}
          />
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
    marginHorizontal: spacing.margin.large,
  },
  memberDescriptionText: {
    marginTop: spacing.margin.tiny,
    marginHorizontal: spacing.margin.large,
  },
});
