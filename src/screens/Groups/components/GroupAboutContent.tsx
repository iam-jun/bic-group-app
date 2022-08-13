import i18next from 'i18next';
import { isEmpty } from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import MenuItem from '~/beinComponents/list/items/MenuItem';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';
import groupsKeySelector from '../../../storeRedux/groups/keySelector';

const GroupAboutContent = () => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === groupJoinStatus.member;

  const groupId = groupData.id;
  const { description, userCount, privacy } = groupData;

  const privacyData = groupPrivacyListDetail.find((item) => item?.type === privacy) || {};
  const { icon, title, subtitle }: any = privacyData || {};

  const onPressMembers = () => {
    rootNavigation.navigate(
      groupStack.groupMembers, { groupId },
    );
  };

  const renderContent = () => (
    <>
      {!!description && (
        <>
          <Text.ButtonM useI18n style={styles.labelDescription}>
            common:text_description
          </Text.ButtonM>
          <CollapsibleText
            limitLength={500}
            shortLength={500}
            textProps={{ variant: 'bodyM', style: styles.descriptionContainer }}
            content={description}
          />
        </>
      )}
      <MenuItem
        testID="group_about_content.members"
        icon="UserGroup"
        onPress={isMember ? onPressMembers : undefined}
        disabled={!isMember}
        title={`${userCount} ${i18next.t('groups:text_members', {
          count: userCount,
        })}`}
        rightSubIcon={isMember ? 'AngleRightSolid' : undefined}
      />
      <MenuItem
        testID="group_about_content.privacy"
        icon={icon}
        title={i18next.t(title)}
        subTitle={i18next.t(subtitle)}
        disabled
      />
    </>
  );

  return (
    <View style={styles.container} testID="group_about_content">
      {isEmpty(groupData) ? <LoadingIndicator /> : renderContent()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.small,
      paddingBottom: 100, // to avoid Join button at the bottom
    },
    labelDescription: {
      paddingVertical: spacing.padding.small,
    },
    descriptionContainer: {
      paddingBottom: spacing.padding.small,
    },
  });
};

export default GroupAboutContent;
