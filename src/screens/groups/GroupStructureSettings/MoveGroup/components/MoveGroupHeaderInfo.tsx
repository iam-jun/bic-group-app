import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Avatar from '~/baseComponents/Avatar';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import { IGroup } from '~/interfaces/IGroup';
import { getAllChildrenName } from '~/screens/groups/helper';
import MoveLine from '~/screens/groups/GroupStructureSettings/MoveGroup/components/MoveLine';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
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
  const styles = createStyle(theme);

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

  const renderAvatar = () => (
    <View>
      <Avatar.Base source={icon} />
      <View style={styles.iconPrivacy}>
        <Icon size={spacing.margin.base} icon={privacyIcon} tintColor={theme.colors.white} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <MoveLine />
      <View style={styles.groupInfo}>
        {renderAvatar()}
        {renderGroupInfo()}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
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
    iconPrivacy: {
      width: 20,
      height: 20,
      position: 'absolute',
      bottom: -2,
      right: -2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.blue50,
      borderRadius: spacing.borderRadius.circle,
    },
    textName: {
      flex: 1,
      marginLeft: spacing.margin.base,
    },
  });
};

export default MoveGroupHeaderInfo;
