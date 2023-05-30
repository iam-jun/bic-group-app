import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import EditButton from '../../components/EditButton';
import ShowingBadges from './ShowingBadges';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Grid from './test';
import useUserBadge from './store';
import images from '~/resources/images';
import Image from '~/components/Image';

const BadgeCollection = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const [isEditing, setEditing] = useState<boolean>(false);

  const actions = useUserBadge((state) => state.actions);
  const ownBadges = useUserBadge((state) => state.ownBadges);

  useEffect(() => {
    actions.getOwnedBadges();
  }, []);

  const editBadge = () => {
    setEditing(true);
  };

  const renderEmptyComponent = () => (
    <View testID="badge_collection.empty" style={styles.boxEmpty}>
      <Image
        resizeMode="contain"
        source={images.img_empty_box}
        style={styles.imgEmpty}
      />
      <Text.H3 color={theme.colors.neutral60} useI18n>
        user:empty_badge_collection:title
      </Text.H3>
      <ViewSpacing height={spacing.margin.tiny} />
      <Text.BodyS color={theme.colors.neutral40} useI18n>
        user:empty_badge_collection:description
      </Text.BodyS>
    </View>
  );

  const renderItem = ({ item: sectionItem }: any) => (
    <View>
      <Text.SubtitleM
        style={styles.header}
        color={colors.neutral40}
      >
        {sectionItem?.name}
      </Text.SubtitleM>
      <Grid data={sectionItem.badges} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{
        paddingHorizontal: spacing.padding.large,
      }}
      >

        <View style={styles.row}>
          <Text.H4 color={colors.neutral40} useI18n>
            user:showing_badges:title
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
        <Text.BodyS color={colors.neutral40} useI18n>
          user:showing_badges:description
        </Text.BodyS>
        <ShowingBadges />
        <Text.H4 color={colors.neutral40} useI18n>
          user:owned_badges:description
        </Text.H4>
        <Text.BodyS color={colors.neutral40} useI18n>
          user:owned_badges:title
        </Text.BodyS>
      </View>
      <ViewSpacing height={spacing.margin.large} />

      <FlatList
        data={ownBadges}
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        ListFooterComponent={() => <ViewSpacing height={100} />}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  boxEmpty: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 48,
  },
  imgEmpty: {
    width: 100,
    aspectRatio: 1,
    marginBottom: spacing.margin.base,
  },
});

export default BadgeCollection;
