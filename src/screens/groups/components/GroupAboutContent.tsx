import i18next from 'i18next';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import MenuItem from '~/beinComponents/list/items/MenuItem';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import { useKeySelector } from '~/hooks/selector';
import spacing from '~/theme/spacing';
import groupsKeySelector from '../../../storeRedux/groups/keySelector';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { formatLargeNumber } from '~/utils/formatData';

export type GroupAboutContentProps = {
  showPrivate?: boolean;
}

const GroupAboutContent: FC<GroupAboutContentProps> = ({ showPrivate }) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;

  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const { description, userCount, privacy } = groupData;

  const privacyData
    = groupPrivacyListDetail.find((item) => item?.type === privacy) || {};
  const { icon, title }: any = privacyData || {};

  const renderDescription = () => {
    if (!description) return null;

    return (
      <View style={styles.descriptionSection}>
        <Text.SubtitleL style={styles.titleDescription} useI18n>
          common:text_description
        </Text.SubtitleL>
        <CollapsibleText
          textProps={{ variant: 'paragraphM' }}
          content={description}
        />
      </View>
    );
  };

  const renderContent = () => (
    <>
      {renderDescription()}
      <MenuItem
        testID="group_about_content.privacy"
        icon={icon}
        title={i18next.t(title)}
        disabled
        iconProps={{ tintColor: colors.neutral20, size: 16 }}
      />
      <MenuItem
        testID="group_about_content.members"
        icon="UserGroup"
        title={`${formatLargeNumber(userCount)} ${i18next.t(
          'groups:text_members',
          {
            count: userCount,
          },
        )}`}
        disabled
        iconProps={{ tintColor: colors.neutral40 }}
      />
    </>
  );

  if (showPrivate) {
    return <View style={styles.container}>{renderDescription()}</View>;
  }

  return (
    <View style={styles.wapper}>
      <ViewSpacing height={spacing.padding.large} />
      <View style={styles.container} testID="group_about_content">
        {isEmpty(groupData) ? <LoadingIndicator /> : renderContent()}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    wapper: {
      flex: 1,
      backgroundColor: colors.neutral5,
    },
    container: {
      backgroundColor: colors.white,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.small,
    },
    titleDescription: {
      marginBottom: spacing.margin.small,
    },
    descriptionSection: {
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.big,
    },
  });
};

export default GroupAboutContent;
