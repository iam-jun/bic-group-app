import i18next from 'i18next';
import {isEmpty} from 'lodash';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import MenuItem from '~/beinComponents/list/items/MenuItem';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import groupJoinStatus from '~/constants/groupJoinStatus';
import privacyTypes from '~/constants/privacyTypes';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import spacing from '~/theme/spacing';
import groupsKeySelector from '../redux/keySelector';

const GroupAboutContent = () => {
  const {rootNavigation} = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const isMember = join_status === groupJoinStatus.member;

  const groupId = groupData.id;
  const {description, user_count, privacy} = groupData;

  const privacyData = privacyTypes.find(item => item?.type === privacy) || {};
  const {icon, title, subtitle}: any = privacyData || {};

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.groupMembers, {groupId});
  };

  const renderContent = () => (
    <>
      {!!description && (
        <>
          <Text.H5 useI18n style={styles.labelDescription}>
            common:text_description
          </Text.H5>
          <CollapsibleText
            limitLength={500}
            shortLength={500}
            textProps={{variant: 'h4', style: styles.descriptionContainer}}
            content={description}
          />
        </>
      )}
      <MenuItem
        testID="group_about_content.members"
        style={styles.memberItem}
        icon={'UserGroup'}
        onPress={isMember ? onPressMembers : undefined}
        disabled={!isMember}
        title={`${user_count} ${i18next.t('groups:text_members', {
          count: user_count,
        })}`}
        rightSubIcon={isMember ? 'AngleRightSolid' : undefined}
      />
      <MenuItem
        testID="group_about_content.privacy"
        style={styles.privacyItem}
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
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.small,
    },
    labelDescription: {
      paddingVertical: spacing.padding.small,
    },
    descriptionContainer: {
      paddingBottom: spacing.padding.small,
    },
    memberItem: {
      height: 44,
    },
    privacyItem: {
      height: 56,
    },
  });
};

export default GroupAboutContent;
