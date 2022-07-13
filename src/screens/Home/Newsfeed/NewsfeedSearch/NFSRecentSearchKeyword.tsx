import React, {FC} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import {useBaseHook} from '~/hooks';

import {useKeySelector} from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';

import Icon from '~/beinComponents/Icon';
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
  const {t} = useBaseHook();
  const theme = useTheme() as ExtendedTheme;
  const styles = createStyle(theme);

  const {loading, data} =
    useKeySelector(homeKeySelector.newsfeedSearchRecentKeyword) || {};

  const onPressClear = () => {
    onClearAllKeyword?.();
  };

  const onPressDeleteItem = (item: any) => {
    onDeleteKeyword?.(item?.id, item?.keyword);
  };

  const onPressItem = (item: any) => {
    onSelectKeyword?.(item?.keyword);
  };

  const renderItem = (item: any, index: number) => {
    return (
      <PrimaryItem
        testID={`recent_search_keyword.item_${index}`}
        key={`recent_item_${item.id}`}
        subTitle={item?.keyword}
        style={styles.item}
        onPress={() => onPressItem(item)}
        height={null}
        RightComponent={
          <TouchableOpacity
            testID={`recent_search_keyword.btn_delete_item_${index}`}
            onPress={() => onPressDeleteItem(item)}>
            <Icon icon={'iconCloseSmall'} size={16} />
          </TouchableOpacity>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text.H6 style={styles.flex1}>
          {t('home:newsfeed_search:label_recent_search')}
        </Text.H6>
        {data?.length > 0 && (
          <Button
            testID={'recent_search_keyword.btn_clear'}
            onPress={onPressClear}
            style={{justifyContent: 'center', alignSelf: 'center'}}>
            <Text.ButtonSmall style={styles.btnClear}>
              {t('home:newsfeed_search:clear').toUpperCase()}
            </Text.ButtonSmall>
          </Button>
        )}
      </View>
      {!!loading && <LoadingIndicator style={styles.loading} />}
      {data?.map?.(renderItem)}
      {!loading && data?.length === 0 && (
        <Text style={styles.textEmpty} useI18n>
          home:newsfeed_search:no_recent_search
        </Text>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      paddingHorizontal: spacing.padding.base,
    },
    header: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnClear: {
      color: colors.purple50,
      marginRight: spacing.margin.tiny,
    },
    loading: {
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    item: {
      paddingVertical: spacing.padding.base,
      paddingRight: spacing.padding.small,
    },
    textEmpty: {
      textAlign: 'center',
      margin: spacing.margin.extraLarge,
      color: colors.gray50,
    },
  });
};

export default NFSRecentSearchKeyword;
