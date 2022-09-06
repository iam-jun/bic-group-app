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

const PreviewMembers = () => {
  const theme: ExtendedTheme = useTheme();

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const { userCount, members } = infoDetail;

  const renderItem = ({ item, index }: { item: IPreviewMember, index: number }) => (
    <Avatar.XSmall style={index ? { marginLeft: -8 } : null} isRounded source={item.avatar} />
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

  return (
    <>
      <ListView
        horizontal
        data={members}
        renderItem={renderItem}
        listStyle={styles.listStyle}
        scrollEnabled={false}
        renderItemSeparator={() => <ViewSpacing width={0} />}
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
