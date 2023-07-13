import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import SearchInput from '~/baseComponents/Input/SearchInput';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import useBaseHook from '~/hooks/baseHook';
import useYourCommunitiesStore from '~/screens/communities/Communities/components/YourCommunities/store';

const SearchCoummunityContent = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const {
    loading, refreshing, ids, actions,
  } = useYourCommunitiesStore();

  const onChangeText = (text: string) => {};
  return (
    <View style={[styles.flex1, styles.container]}>
      <Text.H3 useI18n color={colors.neutral80}>
        Select your community
      </Text.H3>
      <ViewSpacing height={spacing.margin.small} />
      <SearchInput
        style={styles.flex1}
        placeholder={t('home:newsfeed_search:search_people')}
        onChangeText={onChangeText}
      />
      <ViewSpacing height={spacing.margin.large} />
      <FlatList
        data={joinedGroups}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: {
      flex: 1,
    },
    background: {
      backgroundColor: colors.white,
    },
    container: {
      padding: spacing.padding.large,
    },
  });
};

export default SearchCoummunityContent;
