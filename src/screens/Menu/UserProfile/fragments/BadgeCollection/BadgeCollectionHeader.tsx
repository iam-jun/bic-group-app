import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import EditButton from '../../components/EditButton';
import ShowingBadges from './ShowingBadges';
import Text from '~/baseComponents/Text';
import useUserBadge from './store';

const BadgeCollectionHeader = ({ style }: {style?: any}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;

  const isEditing = useUserBadge((state) => state.isEditing);
  const actions = useUserBadge((state) => state.actions);

  const editBadge = () => {
    actions.setIsEditing(true);
  };

  return (
    <View style={[{
      paddingHorizontal: spacing.padding.large,
    }, style]}
    >
      <View style={styles.row}>
        <Text.H4 color={colors.neutral40} useI18n>
          user:showing_badges:title
        </Text.H4>
        {Boolean(!isEditing) && (
        <EditButton
          isCurrentUser
          onPress={editBadge}
          icon="PenToSquareSolid"
          testID="badge_collection.edit_btn"
        />
        )}
      </View>
      <Text.BodyS color={colors.neutral40} useI18n>
        user:showing_badges:description
      </Text.BodyS>
      <ShowingBadges />
      <Text.H4 color={colors.neutral40} useI18n>
        user:owned_badges:title
      </Text.H4>
      <Text.BodyS color={colors.neutral40} useI18n>
        user:owned_badges:description
      </Text.BodyS>
    </View>
  );
};

const themeStyles = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.padding.large,
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
