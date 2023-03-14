import React from 'react';
import {
  FlatList, View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import Checkbox from '~/baseComponents/Checkbox';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Tag from '~/baseComponents/Tag';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import { IEditArticleSeries } from '~/interfaces/IArticle';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

interface Props {
  loading: boolean,
  data: any[],
  selectedData: IEditArticleSeries[],
  onCheckedItem: (isChecked: boolean, item:any)=>void,
  onLoadMore: ()=> void,
}

const ListSeriesWithAudiences = ({
  loading, data, selectedData, onCheckedItem, onLoadMore,
}: Props) => {
  const theme: ExtendedTheme = useTheme();

  const renderTagItem = (item) => {
    const { name } = item;
    return (
      <Tag
        key={`tag_audience_${item?.id}`}
        style={styles.tabStyle}
        textProps={{ numberOfLines: 1 }}
        size="large"
        type="secondary"
        label={name}
      />
    );
  };

  const renderItem = ({ item }: any) => {
    const isChecked = selectedData?.findIndex((selected) => selected?.id === item?.id) > -1;
    return (
      <View testID="series_item" style={styles.container}>
        <View style={styles.row}>
          <Text.BodyM
            numberOfLines={1}
            color={theme.colors.neutral60}
            style={styles.flex1}
          >
            {item.title}
          </Text.BodyM>
          <ViewSpacing width={spacing.margin.small} />
          <Checkbox
            testID="series_item.check_box"
            isChecked={isChecked}
            onPress={(isChecked: boolean) => { onCheckedItem?.(isChecked, item); }}
          />
        </View>
        <View style={styles.listTag}>
          {item?.audience?.groups?.map?.(renderTagItem)}
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return <LoadingIndicator style={styles.loading} />;
    }
    return <NoSearchResultsFound />;
  };

  const renderFooter = () => <View style={styles.footer} />;

  const keyExtractor = (
    item,
  ) => `list_series_with_audience.${item.id}`;

  return (
    <FlatList
      testID="list_series_with_audiences.list_series"
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter()}
      onEndReachedThreshold={0.1}
      onEndReached={onLoadMore}
    />
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    paddingHorizontal: spacing.padding.large,
  },
  row: {
    paddingTop: spacing.padding.base,
    paddingBottom: spacing.padding.xSmall,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listTag: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  tabStyle: {
    marginTop: spacing.margin.xSmall,
  },
  footer: {
    marginBottom: spacing.margin.base,
  },
  loading: {
    marginTop: spacing.margin.extraLarge,
  },
});

export default ListSeriesWithAudiences;
