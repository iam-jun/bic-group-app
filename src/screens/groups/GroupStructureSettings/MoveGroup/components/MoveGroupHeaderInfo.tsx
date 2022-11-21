import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Avatar from '~/baseComponents/Avatar';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { IGroup } from '~/interfaces/IGroup';
import { getAllChildrenName } from '~/screens/groups/helper';
import MoveLine from '~/screens/groups/GroupStructureSettings/MoveGroup/components/MoveLine';
import spacing from '~/theme/spacing';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface MoveGroupHeaderInfoProps {
  group: IGroup;
}

const MoveGroupHeaderInfo: FC<MoveGroupHeaderInfoProps> = ({
  group,
}: MoveGroupHeaderInfoProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle();

  const { privacy, icon, name } = group || {};
  const privacyData = groupPrivacyListDetail.find((i) => i?.type === privacy) || {};
  const { icon: privacyIcon }: any = privacyData || {};

  const childrenGroups = getAllChildrenName(group);

  const renderGroupName = () => (
    <Text.BodyMMedium
      numberOfLines={1}
      style={styles.textName}
      color={theme.colors.neutral60}
    >
      {name}
    </Text.BodyMMedium>
  );

  const renderGroupInfo = () => {
    if (childrenGroups.length > 0) {
      return (
        <View style={styles.flex1}>
          {renderGroupName()}
          <ViewSpacing height={2} />
          <Text.BodyS
            numberOfLines={1}
            style={styles.textName}
            color={theme.colors.neutral60}
          >
            {t('communities:group_structure:text_included_inner_groups')
              .replace('{0}', childrenGroups.length)}
          </Text.BodyS>
        </View>
      );
    }

    return renderGroupName();
  };

  return (
    <View style={styles.container}>
      <MoveLine />
      <View style={styles.groupInfo}>
        <Avatar.Base source={icon} privacyIcon={privacyIcon} />
        {renderGroupInfo()}
      </View>
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.margin.extraLarge,
    marginBottom: spacing.margin.big,
  },
  flex1: { flex: 1 },
  groupInfo: {
    flex: 1,
    marginVertical: spacing.margin.large,
    paddingRight: spacing.padding.large,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textName: {
    flex: 1,
    marginLeft: spacing.margin.base,
  },
});

export default MoveGroupHeaderInfo;
