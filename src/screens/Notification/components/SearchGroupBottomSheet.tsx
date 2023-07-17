import React, { useCallback, useState } from 'react';
import {
  View, StyleSheet, Dimensions, ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import SearchInput from '~/baseComponents/Input/SearchInput';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import useBaseHook from '~/hooks/baseHook';
import AdvancedSettingItem from './AdvancedSettingItem';
import BottomSheet from '~/baseComponents/BottomSheet';
import useAdvancedNotiSettingsStore from '../AdvancedSettings/store';
import appConfig from '~/configs/appConfig';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';

const screenHeight = Dimensions.get('window').height;
const modalHeight = 0.8 * screenHeight;
interface Props {
  modalizeRef: any;
  onPressItem: (item: any) => void;
}

const SearchGroupBottomSheet = ({ modalizeRef, onPressItem }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const [searchText, setSearchText] = useState('');

  const {
    actions, searchJoinedGroups,
    hasSearchNextPage, joinedGroups, hasNextPage, selectedCommunity,
    isLoadingJoinedGroup,
  } = useAdvancedNotiSettingsStore((state) => state);

  const needUseDefault = !Boolean(searchText?.trim?.()?.length > 0);
  const shouldShowData = needUseDefault ? joinedGroups : searchJoinedGroups;

  const searchGroup = (text: string) => {
    setSearchText(text);
    actions.searchJoinedGroupFlat({ key: text }, true);
  };

  const searchHandler = useCallback(
    debounce(
      searchGroup, appConfig.searchTriggerTime,
    ),
    [],
  );

  const onChangeText = (text: string) => {
    searchHandler(text);
  };

  const onLoadMore = () => {
    if (isLoadingJoinedGroup) return;
    if (needUseDefault && hasNextPage) {
      actions.getJoinedGroupFlat(selectedCommunity.id);
    } else if (hasSearchNextPage) {
      actions.searchJoinedGroupFlat({ key: searchText });
    }
  };

  const onResetSearchText = () => {
    setSearchText('');
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer]}>
      <Text.H3 useI18n color={colors.neutral80}>
        notification:advanced_notifications_settings:search_group_title
      </Text.H3>
      <ViewSpacing height={spacing.margin.small} />
      <SearchInput
        autoFocus
        placeholder={t('notification:advanced_notifications_settings:search_group_placeholder')}
        onChangeText={onChangeText}
      />
    </View>
  );

  const renderItem = ({ item }: any) => (
    <AdvancedSettingItem
      key={`communtiy.${item}`}
      item={item}
      onPress={onPressItem}
    />
  );

  const renderListFooter = () => {
    if ((needUseDefault && !hasNextPage) || (!needUseDefault && !hasSearchNextPage)) return null;
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator testID="your_communites.loading_more" />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoadingJoinedGroup) return null;
    return (
      <EmptyScreen
        source={images.img_empty_search_post}
        description="common:text_search_no_results"
      />
    );
  };

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      disableScrollIfPossible={false}
      childrenStyle={styles.container}
      onClose={onResetSearchText}
      HeaderComponent={renderHeader}
      flatListProps={{
        data: shouldShowData,
        keyboardShouldPersistTaps: 'handled',
        showsVerticalScrollIndicator: false,
        scrollEnabled: true,
        scrollEventThrottle: 16,
        keyExtractor: (item) => `advanced_settings.search_group.${item?.id}`,
        renderItem: ({ item }) => renderItem({ item }),
        ListFooterComponent: renderListFooter,
        ListEmptyComponent: renderEmptyComponent,
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

export default SearchGroupBottomSheet;
