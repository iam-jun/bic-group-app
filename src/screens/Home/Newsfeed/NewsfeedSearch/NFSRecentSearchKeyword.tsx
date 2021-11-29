import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import homeActions from '~/screens/Home/redux/actions';
import homeKeySelector from '~/screens/Home/redux/keySelector';

import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

const NFSRecentSearchKeyword = () => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {loading, data} =
    useKeySelector(homeKeySelector.newsfeedSearchRecentKeyword) || {};

  const onPressClear = () => {
    alert('clear');
  };

  const onPressDeleteItem = (item: any) => {
    alert('delete item');
  };

  const onPressItem = (item: any) => {
    dispatch(
      homeActions.setNewsfeedSearch({
        isSuggestion: false,
        searchResults: [],
        searchText: item?.keyword,
      }),
    );
  };

  const renderItem = (item: any) => {
    return (
      <PrimaryItem
        key={`recent_item_${item.id}`}
        subTitle={item?.keyword}
        style={styles.item}
        onPress={() => onPressItem(item)}
        height={null}
        RightComponent={
          <TouchableOpacity onPress={() => onPressDeleteItem(item)}>
            <Icon icon={'iconCloseSmall'} size={16} />
          </TouchableOpacity>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <View style={styles.header}>
            <Text.H6 style={styles.flex1}>
              {t('home:newsfeed_search:label_recent_search')}
            </Text.H6>
            <Button
              onPress={onPressClear}
              style={{justifyContent: 'center', alignSelf: 'center'}}>
              <Text.ButtonSmall style={styles.btnClear}>
                {t('home:newsfeed_search:clear').toUpperCase()}
              </Text.ButtonSmall>
            </Button>
          </View>
          {!!loading && <LoadingIndicator style={styles.loading} />}
          {data?.map?.(renderItem)}
        </View>
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
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
      color: colors.primary6,
      marginRight: spacing.margin.tiny,
    },
    loading: {
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    item: {
      paddingVertical: spacing.padding.base,
      paddingLeft: 0,
      paddingRight: spacing.padding.small,
    },
  });
};

export default NFSRecentSearchKeyword;
