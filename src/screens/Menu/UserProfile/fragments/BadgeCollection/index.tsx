import React, { useState } from 'react';
import {
  View, StyleSheet, DeviceEventEmitter, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { throttle } from 'lodash';
import Text from '~/baseComponents/Text';
import { dimension, spacing } from '~/theme';
import EditButton from '../../components/EditButton';
import ShowingBadges from './ShowingBadges';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useUserBadge from './store';
import images from '~/resources/images';
import Image from '~/components/Image';
import { IUserBadge } from '~/interfaces/IEditUser';
import { SearchInput } from '~/baseComponents/Input';
import useBaseHook from '~/hooks/baseHook';
import { fontFamilies } from '~/theme/fonts';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Grid from './Grid';
import BadgeNew from './BadgeNew';

interface Props {
  showSearchBox?: boolean;
}

const BadgeCollection = ({ showSearchBox }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const { t } = useBaseHook();

  const [searchText, setSearchText] = useState('');

  const actions = useUserBadge((state) => state.actions);
  const dataSearch = useUserBadge((state) => state.dataSearch);
  const isEditing = useUserBadge((state) => state.isEditing);
  const choosingBadges = useUserBadge((state) => state.choosingBadges);
  const totalBadges = useUserBadge((state) => state.totalBadges);

  const totalBadgesText = t('user:owned_badges:total_badges').replace('(total)', totalBadges);
  const loadingSearch = useUserBadge((state) => state.loadingSearch);

  const disabled = checkIsDisabled(choosingBadges) && isEditing && Boolean(showSearchBox);

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

  const onChangeText = (text: string) => {
    setSearchText(text);
    if (!text || text?.trim?.()?.length === 0) {
      actions.searchBadges('');
    }
  };

  const searchBadges = () => {
    actions.searchBadges(searchText);
  };

  const handleScroll = throttle(
    () => {
      DeviceEventEmitter.emit(
        'off-tooltip',
      );
    }, 100,
  );

  const renderEmptyComponent = () => {
    if (loadingSearch) {
      return <LoadingIndicator style={{ margin: spacing.margin.small }} />;
    }
    if (!loadingSearch && dataSearch.length === 0) return <NoSearchResultsFound />;
    return (
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
  };

  const renderItem = ({ item: sectionItem }: any) => (
    <View>
      <Text.SubtitleM
        style={styles.header}
        color={colors.neutral40}
      >
        {sectionItem?.name}
        <Text.BadgeS color={colors.neutral40}>{` (${sectionItem?.badges?.length})`}</Text.BadgeS>
        {' '}
        {Boolean(sectionItem?.isNew) && (
        <BadgeNew />
        ) }
      </Text.SubtitleM>
      <Grid
        data={sectionItem.badges}
        disabled={disabled}
        shouldHideBadgeNew={Boolean(sectionItem?.isNew)}
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
        <ShowingBadges isShowEditButton={showSearchBox} />
        <Text.H4 color={colors.neutral40}>
          {t('user:owned_badges:title')}
          <Text.BadgeS color={colors.neutral40}>
            {` ${totalBadgesText}`}
          </Text.BadgeS>
        </Text.H4>
        <Text.BodyS color={colors.neutral40} useI18n>
          user:owned_badges:description
        </Text.BodyS>
      </View>
      {Boolean(showSearchBox)
       && (
       <SearchInput
         style={styles.textInput}
         autoComplete="off"
         placeholder={t('user:owned_badges:search_placeholder')}
         placeholderTextColor={theme.colors.gray40}
         selectionColor={theme.colors.gray50}
         onChangeText={onChangeText}
         onEndEditing={searchBadges}
       />
       )}
      <ViewSpacing height={spacing.margin.large} />
      <FlatList
        data={dataSearch}
        nestedScrollEnabled
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        ListFooterComponent={() => <ViewSpacing height={100} />}
        ListEmptyComponent={renderEmptyComponent}
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
      marginHorizontal: spacing.margin.large,
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
    textInput: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
      color: colors.neutral80,
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.small,
    },
  });
};

export default BadgeCollection;
