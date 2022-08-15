import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Avatar from '~/baseComponents/Avatar';
import Divider from '~/beinComponents/Divider';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import { IGroup } from '~/interfaces/IGroup';
import { getAllChildrenName } from '~/screens/groups/helper';
import MoveLine from '~/screens/groups/GroupStructureSettings/MoveGroup/components/MoveLine';
import spacing from '~/theme/spacing';

export interface MoveGroupHeaderInfoProps {
  group: IGroup;
}

const MoveGroupHeaderInfo: FC<MoveGroupHeaderInfoProps> = ({
  group,
}: MoveGroupHeaderInfoProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const { icon, name } = group || {};

  const childrenName = getAllChildrenName(group).join?.(', ');

  return (
    <View style={styles.container}>
      <MoveLine />
      <View style={styles.infoContainer}>
        <View style={styles.groupNameContainer}>
          <Avatar.Tiny style={styles.iconGroup} source={icon} />
          <Text.H6 style={styles.groupName} numberOfLines={1}>
            {name}
          </Text.H6>
        </View>
        {!!childrenName && (
          <>
            <Divider color={colors.gray40} />
            <View style={styles.childrenInfo}>
              <Text.BodyS>
                <Text.BodySMedium>{childrenName}</Text.BodySMedium>
                {' '}
                {t('communities:group_structure:text_will_be_move')}
                {' '}
                <Text.BodySMedium>{name}</Text.BodySMedium>
              </Text.BodyS>
            </View>
          </>
        )}
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
      marginBottom: spacing.margin.large,
    },
    infoContainer: {
      marginLeft: 0,
      flex: 1,
      marginTop: spacing.margin.extraLarge,
      borderWidth: 1,
      borderColor: colors.gray40,
      alignSelf: 'flex-start',
      marginBottom: spacing.margin.extraLarge,
    },
    childrenInfo: {
      padding: spacing.padding.small,
    },
    groupNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.neutral1,
      paddingVertical: 2,
    },
    groupName: {
      flex: 1,
    },
    iconGroup: {
      marginHorizontal: spacing.margin.small,
      marginVertical: spacing.margin.tiny,
    },
    blueDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.blue50,
      marginTop: spacing.margin.extraLarge,
      marginRight: spacing.margin.small,
    },
  });
};

export default MoveGroupHeaderInfo;
