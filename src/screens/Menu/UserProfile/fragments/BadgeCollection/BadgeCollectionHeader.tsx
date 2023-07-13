import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import EditButton from '../../components/EditButton';
import Text from '~/baseComponents/Text';
import useUserBadge from './store';
import useBaseHook from '~/hooks/baseHook';
import ShowingBadges from '../../components/ShowingBadges/ShowingBadges';

interface BadgeCollectionHeaderProps {
  isShowEditButton?:boolean;
}

const BadgeCollectionHeader = ({ isShowEditButton }: BadgeCollectionHeaderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;

  const { t } = useBaseHook();

  const isEditing = useUserBadge((state) => state.isEditing);
  const actions = useUserBadge((state) => state.actions);
  const totalBadges = useUserBadge((state) => state.totalBadges);

  const editBadge = () => {
    actions.setIsEditing(true);
  };

  const totalBadgesText = t('user:owned_badges:total_badges').replace('(total)', totalBadges);

  return (
    <View testID="badge_collection_header.view" style={styles.container}>
      <View style={styles.row}>
        <Text.H4 color={colors.neutral40} useI18n>
          user:showing_badges:title
        </Text.H4>
        {Boolean(!isEditing) && (
        <EditButton
          isCurrentUser
          onPress={editBadge}
          icon="PenToSquareSolid"
          testID="badge_collection_header.edit_btn"
        />
        )}
      </View>
      <Text.BodyS color={colors.neutral40} useI18n>
        user:showing_badges:description
      </Text.BodyS>
      <ShowingBadges isShowEditButton={isShowEditButton} />
      <Text.H4 color={colors.neutral40}>
        {t('user:owned_badges:title')}
        <Text.BadgeS
          color={colors.neutral40}
          testID="badge_collection_header.total_badges"
        >
          {` ${totalBadgesText}`}
        </Text.BadgeS>
      </Text.H4>
      <Text.BodyS color={colors.neutral40} useI18n>
        user:owned_badges:description
      </Text.BodyS>
    </View>
  );
};

const themeStyles = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: spacing.margin.large,
    paddingHorizontal: spacing.margin.large,
  },
});

export default BadgeCollectionHeader;
