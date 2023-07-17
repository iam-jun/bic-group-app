import React, { useState } from 'react';
import {
  View, StyleSheet, Dimensions, ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import SearchInput from '~/baseComponents/Input/SearchInput';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import useBaseHook from '~/hooks/baseHook';
import useYourCommunitiesStore from '~/screens/communities/Communities/components/YourCommunities/store';
import AdvancedSettingItem from './AdvancedSettingItem';
import BottomSheet from '~/baseComponents/BottomSheet';
import useSearchJoinedCommunitiesStore from '~/screens/communities/Communities/components/SearchCommunity/store';

const screenHeight = Dimensions.get('window').height;
const modalHeight = 0.8 * screenHeight;
interface Props {
  modalizeRef: any;
  onPressItem: (item: any) => void;
}

const SearchCoummunityContent = ({ modalizeRef, onPressItem }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const [searchText, setSearchText] = useState('');

  const {
    ids: defaultIds, items: defaultItems, hasNextPage: hasNextPageDefault, actions,
  } = useYourCommunitiesStore();
  const {
    hasNextPage, ids, items, actions: joinedActions,
  } = useSearchJoinedCommunitiesStore();
  const needUseDefault = !Boolean(searchText?.trim?.()?.length > 0);
  const shouldShowData = needUseDefault ? defaultIds : ids;

  const onChangeText = (searchText: string) => {
    setSearchText(searchText);
    joinedActions.searchJoinedCommunities({ key: searchText });
  };

  const onLoadMore = () => {
    if (needUseDefault && hasNextPageDefault) {
      actions.getYourCommunities();
    } else if (hasNextPage) {
      joinedActions.searchJoinedCommunities({ key: searchText });
    }
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer]}>
      <Text.H3 useI18n color={colors.neutral80}>
        notification:advanced_notifications_settings:search_title
      </Text.H3>
      <ViewSpacing height={spacing.margin.small} />
      <SearchInput
        placeholder={t('notification:advanced_notifications_settings:search_placeholder')}
        onChangeText={onChangeText}
      />
    </View>
  );

  const renderItem = (item: string) => {
    const currentItem = needUseDefault ? defaultItems[item] : items[item];
    return (
      <AdvancedSettingItem
        key={`communtiy.${item}`}
        item={currentItem}
        onPress={onPressItem}
      />
    );
  };

  const renderListFooter = () => {
    if ((needUseDefault && !hasNextPageDefault) || (!needUseDefault && !hasNextPage)) return null;
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator testID="your_communites.loading_more" />
      </View>
    );
  };

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      disableScrollIfPossible={false}
      childrenStyle={styles.container}
      HeaderComponent={renderHeader}
      flatListProps={{
        data: shouldShowData,
        keyboardShouldPersistTaps: 'handled',
        showsVerticalScrollIndicator: false,
        scrollEnabled: true,
        scrollEventThrottle: 16,
        keyExtractor: (item) => `communtiy.${item}`,
        renderItem: ({ item }) => renderItem(item),
        ListFooterComponent: renderListFooter,
        onEndReached: onLoadMore,
      }}
    />
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
      height: modalHeight,
    },
    headerContainer: {
      padding: spacing.padding.large,
    },
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default SearchCoummunityContent;
