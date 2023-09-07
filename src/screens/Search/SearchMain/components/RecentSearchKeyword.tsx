import React, { FC, useLayoutEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Keyboard,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';

import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import Button from '~/beinComponents/Button';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import spacing from '~/theme/spacing';
import useSearchStore from '../../store';
import { IRecentSearchKeywordItem } from '~/interfaces/ISearch';

export type RecentSearchKeywordProps = {
  searchScreenKey: string;
}

const RecentSearchKeyword: FC<RecentSearchKeywordProps> = ({
  searchScreenKey,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle();

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const { loading, data }
    = useSearchStore((state) => state.recentSearchKeyword);

  useLayoutEffect(
    () => {
      actionsSearchStore.getRecentSearchKeywords({
        target: 'post',
        order: 'DESC',
        limit: 10,
        showLoading: true,
      });
    }, [],
  );

  const onPressClear = () => {
    actionsSearchStore.deleteRecentSearchAll('post');
  };

  const onPressDeleteItem = (item: IRecentSearchKeywordItem) => {
    actionsSearchStore.deleteRecentSearchById(item?.id);
  };

  const onPressItem = (item: IRecentSearchKeywordItem) => {
    Keyboard.dismiss();
    actionsSearchStore.updateSearchDataByScreenKey(searchScreenKey, {
      searchText: item?.keyword,
      isSuggestion: false,
      loadingResult: false,
      hasNextPage: true,
      endCursor: null,
      searchResults: [],
      totalResults: 0,
    });
  };

  const renderItem = (item: any, index: number) => (
    <PrimaryItem
      testID={`recent_search_keyword.item_${index}`}
      key={`recent_item_${item.id}`}
      subTitle={item?.keyword}
      subTitleProps={{ variant: 'bodyMMedium' }}
      style={styles.item}
      onPress={() => onPressItem(item)}
      leftIcon="Clock"
      leftIconProps={{
        style: { marginRight: spacing.margin.base },
        tintColor: theme.colors.neutral20,
        size: 18,
      }}
      RightComponent={(
        <TouchableOpacity
          testID={`recent_search_keyword.btn_delete_item_${index}`}
          onPress={() => onPressDeleteItem(item)}
        >
          <Icon icon="iconCloseSmall" size={16} />
        </TouchableOpacity>
      )}
    />
  );

  if (!loading && data?.length === 0) {
    return (
      <Text.BodyS style={styles.textEmpty} useI18n>
        home:newsfeed_search:no_recent_search
      </Text.BodyS>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text.H4 style={styles.flex1}>
          {t('home:newsfeed_search:label_recent_search')}
        </Text.H4>
        {data?.length > 0 && (
          <Button
            testID="recent_search_keyword.btn_clear"
            onPress={onPressClear}
            style={{ justifyContent: 'center', alignSelf: 'center' }}
          >
            <Text.LinkS>{t('home:newsfeed_search:clear')}</Text.LinkS>
          </Button>
        )}
      </View>
      {!!loading && <LoadingIndicator style={styles.loading} />}
      {data?.map?.(renderItem)}
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    paddingHorizontal: spacing.padding.large,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnClear: {
    marginRight: spacing.margin.large,
  },
  loading: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    paddingVertical: spacing.padding.base,
    paddingHorizontal: 0,
  },
  textEmpty: {
    textAlign: 'center',
    margin: spacing.margin.extraLarge,
  },
});

export default RecentSearchKeyword;
