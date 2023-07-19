import React, { useCallback, useState } from 'react';
import {
  View, StyleSheet, Dimensions, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import { useKeyboard } from '@react-native-community/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const LIMIT_FOR_SEARCH = 500;
interface Props {
  modalizeRef: any;
  onPressItem: (item: any) => void;
}

const SearchGroupBottomSheet = ({ modalizeRef, onPressItem }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboard();

  const [searchText, setSearchText] = useState('');

  const {
    actions, searchJoinedGroups, joinedGroups,
    isLoadingJoinedGroup,
  } = useAdvancedNotiSettingsStore((state) => state);

  const needUseDefault = !Boolean(searchText?.trim?.()?.length > 0);
  const shouldShowData = needUseDefault ? joinedGroups : searchJoinedGroups;

  const searchGroup = (text: string) => {
    setSearchText(text);
    actions.searchJoinedGroupFlat({ key: text, limit: LIMIT_FOR_SEARCH }, true);
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
        <View testID="edit_location" style={styles.contentContainerStyle}>
          {renderHeader()}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.childrenStyle}
            scrollEventThrottle={16}
          >
            {shouldShowData?.length > 0 ? (shouldShowData).map((item) => (
              <View key={`advanced_settings.search_group.${item?.id}`}>
                {renderItem({ item })}
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
    container: {
      height: modalHeight,
    },
    headerContainer: {
      padding: spacing.padding.large,
    },
    listFooter: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    childrenStyle: {
      maxHeight: modalHeight,
      paddingBottom: 0,
    },
    contentContainerStyle: {
      height: '100%',
    },
  });
};

export default SearchGroupBottomSheet;
