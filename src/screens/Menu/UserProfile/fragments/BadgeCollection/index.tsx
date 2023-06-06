import React, { useEffect } from 'react';
import {
  View, StyleSheet, FlatList, DeviceEventEmitter,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import EditButton from '../../components/EditButton';
import ShowingBadges from './ShowingBadges';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Grid from './Grid';
import useUserBadge from './store';
import images from '~/resources/images';
import Image from '~/components/Image';
import { IUserBadge } from '~/interfaces/IEditUser';

const SCROLL_MAX_HEIGHT = 400;

const BadgeCollection = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  const actions = useUserBadge((state) => state.actions);
  const ownBadges = useUserBadge((state) => state.ownBadges);
  const isEditing = useUserBadge((state) => state.isEditing);
  const choosingBadges = useUserBadge((state) => state.choosingBadges);

  const disabled = checkIsDisabled(choosingBadges) && isEditing;

  useEffect(() => {
    actions.getOwnedBadges();
  }, []);

  const editBadge = () => {
    actions.setIsEditing(true);
  };

  const onPress = (item: IUserBadge, isSelected: boolean) => {
    if (!isEditing) return;
    if (!isSelected) {
      actions.fillChoosingBadges(item);
    } else {
      const index = choosingBadges.findIndex((badge) => badge?.id === item?.id);
      actions.removeChoosingBadges(index);
    }
  };

  const handleScroll = () => {
    DeviceEventEmitter.emit(
      'off-tooltip',
    );
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
      <Grid
        data={sectionItem.badges}
        disabled={disabled}
        onPress={onPress}
      />
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
      <ViewSpacing height={spacing.margin.large} />

      <FlatList
        data={ownBadges}
        nestedScrollEnabled
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        ListFooterComponent={() => <ViewSpacing height={100} />}
        ListEmptyComponent={renderEmptyComponent}
        style={{ maxHeight: SCROLL_MAX_HEIGHT }}
        onScroll={handleScroll}
      />
    </View>
  );
};

const checkIsDisabled = (badges: IUserBadge[]) => {
  if (badges.length < 3) return false;
  let result = true;
  badges.forEach((badge) => {
    if (!badge?.id) {
      result = false;
    }
  });

  return result;
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
