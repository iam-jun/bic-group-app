import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';

import { useKeySelector } from '~/hooks/selector';
import homeKeySelector from '~/storeRedux/home/keySelector';

import Icon from '~/baseComponents/Icon';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import spacing from '~/theme/spacing';

export interface NFSRecentSearchKeywordProps {
  onSelectKeyword?: (keyword: string) => void;
  onDeleteKeyword?: (id: string, keyword: string) => void;
  onClearAllKeyword?: () => void;
}

const NFSRecentSearchKeyword: FC<NFSRecentSearchKeywordProps> = ({
  onSelectKeyword,
  onDeleteKeyword,
  onClearAllKeyword,
}: NFSRecentSearchKeywordProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { loading, data }
    = useKeySelector(homeKeySelector.newsfeedSearchRecentKeyword) || {};

  const onPressClear = () => {
    onClearAllKeyword?.();
  };

  const onPressDeleteItem = (item: any) => {
    onDeleteKeyword?.(item?.id, item?.keyword);
  };

  const onPressItem = (item: any) => {
    onSelectKeyword?.(item?.keyword);
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

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
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
};

export default NFSRecentSearchKeyword;
