import React, { useState } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import EditButton from '../../components/EditButton';
import ShowingBadges from './ShowingBadges';
import { mockOwnedBadges } from '~/test/mock_data/userProfile';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Grid from './test';

const BadgeCollection = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  const [isEditing, setEditing] = useState<boolean>(false);

  const editBadge = () => {
    setEditing(true);
  };

  const renderItem = ({ item: sectionItem }: any) => (
    <View>
      <Text.SubtitleM style={styles.header} color={colors.neutral40}>{sectionItem.name}</Text.SubtitleM>
      <Grid data={sectionItem.data} />
      {/* <View style={styles.breakLine}>
        {
          sectionItem.data?.map((item, index) => (
            <View style={[styles.itemContainer, index !== sectionItem.length - 1 && styles.marginRight]} key={`owned_badge_${item.id}`}>
              <Avatar.Medium
                isRounded
                source={{ uri: item?.iconUrl }}
              />
              <View style={styles.iconChose}>
                <Icon size={10} icon="Check" tintColor={colors.white} />
              </View>
            </View>
          ))
}
      </View> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{
        paddingHorizontal: spacing.padding.large,
      }}
      >

        <View style={styles.row}>
          <Text.H4 color={colors.neutral40}>
            Showing Badges
          </Text.H4>
          {!isEditing
            ? (
              <EditButton
                isCurrentUser
                onPress={editBadge}
                icon="PenToSquareSolid"
                testID="badge_collection.edit_btn"
              />
            )
            : null}
        </View>
        <Text.BodyS color={colors.neutral40}>
          The badges you choose to show on your profile
        </Text.BodyS>
        <ShowingBadges />
        <Text.H4 color={colors.neutral40}>
          Badges List
        </Text.H4>
        <Text.BodyS color={colors.neutral40}>
          Badges you received from the communities you joined
        </Text.BodyS>
      </View>
      <ViewSpacing height={spacing.margin.large} />

      <FlatList
        data={mockOwnedBadges}
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        ListFooterComponent={() => <ViewSpacing height={100} />}
      />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
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
    itemContainer: {
    },
    marginRight: {
      marginRight: spacing.margin.base,
    },
    title: {
      fontSize: 24,
    },

    breakLine: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    //   justifyContent: 'center',
    },
  });
};

export default BadgeCollection;
