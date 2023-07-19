import React, { useState } from 'react';
import {
  View, StyleSheet, Dimensions, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
import SearchInput from '~/baseComponents/Input/SearchInput';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import useBaseHook from '~/hooks/baseHook';
import useYourCommunitiesStore from '~/screens/communities/Communities/components/YourCommunities/store';
import AdvancedSettingItem from './AdvancedSettingItem';
import BottomSheet from '~/baseComponents/BottomSheet';
import useSearchJoinedCommunitiesStore from '~/screens/communities/Communities/components/SearchCommunity/store';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';

const LIMIT_FOR_SEARCH = 500;

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
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboard();

  const [searchText, setSearchText] = useState('');

  const {
    ids: defaultIds, items: defaultItems,
  } = useYourCommunitiesStore();
  const {
    ids, items, actions: joinedActions, reset, loading,
  } = useSearchJoinedCommunitiesStore();
  const needUseDefault = !Boolean(searchText?.trim?.()?.length > 0);
  const shouldShowData = needUseDefault ? defaultIds : ids;

  const onChangeText = (text: string) => {
    reset();
    setSearchText(text);
    joinedActions.searchJoinedCommunities({ key: text, limit: LIMIT_FOR_SEARCH }, true);
  };

  const onResetSearchText = () => {
    setSearchText('');
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer]}>
      <Text.H3 useI18n color={colors.neutral80}>
        notification:advanced_notifications_settings:search_community_title
      </Text.H3>
      <ViewSpacing height={spacing.margin.small} />
      <SearchInput
        autoFocus
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

  const renderEmptyComponent = () => {
    if (loading) return null;
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
      handlePosition="inside"
      childrenStyle={styles.childrenStyle}
      onClosed={onResetSearchText}
      closeSnapPointStraightEnabled={false}
      scrollViewProps={{
        keyboardShouldPersistTaps: 'handled',
        keyboardDismissMode: 'interactive',
        contentContainerStyle: {
          height: '100%',
        },
      }}
      ContentComponent={(
        <View testID="edit_location" style={styles.container}>
          {renderHeader()}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.flex1}
            scrollEventThrottle={16}
          >
            {shouldShowData?.length > 0 ? (shouldShowData).map((item) => (
              <View key={`advanced_settings.search_communtiy.${item}`}>
                {renderItem(item)}
              </View>
            ))
              : renderEmptyComponent()}
            <ViewSpacing height={insets.bottom} />
            <View style={{ height: keyboard?.keyboardHeight || 0 }} />
          </ScrollView>
        </View>
      )}
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
    childrenStyle: {
      maxHeight: modalHeight,
      paddingBottom: 0,
    },
    headerContainer: {
      padding: spacing.padding.large,
    },
    container: {
      height: modalHeight,
    },
    contentContainerStyle: {
      height: '100%',
    },
  });
};

export default SearchCoummunityContent;
