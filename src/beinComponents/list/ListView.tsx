/* eslint-disable react/no-unstable-nested-components */
import _ from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import items, { IListViewItem } from '~/beinComponents/list/items';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import loadings from '~/beinComponents/list/loadings';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useKeySelector } from '~/hooks/selector';

import spacing from '~/theme/spacing';

export interface ListViewProps {
  data?: Array<any>;
  type?: IListViewItem;
  listRef?: React.Ref<FlatList>;
  listStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;

  onItemPress?: (...params: any) => void;
  onItemLongPress?: (...params: any) => void;
  onActionPress?: (...params: any) => void;
  onRefresh?: () => void;
  onLoadMore?: () => void;

  titleField?: string;
  subTitleField?: string;
  loadMoreColor?: string;
  onEndReachedThreshold?: number;

  itemTestID?: string;
  renderItem?: ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => React.ReactElement;
  renderItemSeparator?: any;
  showItemSeparator?: boolean;
  renderLoading?: any;
  ListHeaderComponent: any;
  ListFooterComponent: any;
  ListEmptyComponent: any;
  itemStyle?: StyleProp<ViewStyle>;

  horizontal?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  loadingMore?: boolean;
  title?: string;
  isFullView?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  currentPath?: string;

  [x: string]: any;
}

const ListView: React.FC<ListViewProps> = ({
  data,
  type = 'primary',
  listRef,
  listStyle,
  containerStyle,

  onItemPress,
  onItemLongPress,
  onRefresh,
  onLoadMore,

  titleField,
  subTitleField,
  onEndReachedThreshold = 0.1,

  renderItem,
  itemTestID,
  renderItemSeparator,
  showItemSeparator = true,
  renderLoading,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  itemStyle,

  horizontal,
  loading,
  loadingMore,
  refreshing,
  title,
  isFullView,
  keyboardShouldPersistTaps,
  currentPath,
  ...props
}: ListViewProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const { colors } = useTheme() as ExtendedTheme;

  const ItemComponent = items[type] || PrimaryItem;
  const LoadingPlaceholder = loadings[type];

  const _renderItem = ({ item, index }: {item: any; index: number}) => {
    if (renderItem) {
      return renderItem({ item, index });
    }

    let itemPath = '';
    let isActive = false;

    switch (type) {
      case 'menu':
        itemPath = item.path;
        break;
      case 'notification':
        itemPath = item.id;
        break;
      default:
        break;
    }
    if (currentPath && itemPath === currentPath) isActive = true;

    return (
      <TouchableOpacity
        testID={`list_view.item_wrapper.${index}`}
        disabled={!isInternetReachable || !onItemPress || item.disableClick}
        onPress={(e: any) => onItemPress && onItemPress(item, e)}
        onLongPress={(e: any) => onItemLongPress && onItemLongPress(item, e)}
      >
        <ItemComponent
          testID={itemTestID ? `${itemTestID}.item.${index}` : undefined}
          {...item}
          disabled={!isInternetReachable}
          title={item[titleField || 'title']}
          subTitle={item[subTitleField || 'subTitle']}
          style={itemStyle}
          // eslint-disable-next-line react/prop-types
          total={data && data?.length}
          index={index}
          isActive={isActive}
        />
      </TouchableOpacity>
    );
  };

  const _renderItemSeparator = () => {
    if (!showItemSeparator) {
      return null;
    } if (renderItemSeparator) {
      return renderItemSeparator();
    }
    return (
      <ViewSpacing
        width={horizontal ? spacing.margin.small : 0}
        height={!horizontal ? spacing.margin.small : 0}
      />
    );
  };
  const _renderLoading = () => {
    if (loading) {
      if (renderLoading) {
        return renderLoading();
      }
      if (LoadingPlaceholder) {
        return (
          <View testID="list_view.loading_placeholder">
            {Array.from(Array(10).keys()).map((item) => (
              <LoadingPlaceholder key={`loading_placeholder_${item}`} />
            ))}
          </View>
        );
      }
      return (
        <View style={{ marginTop: spacing.margin.large }}>
          <ActivityIndicator
            color={colors.gray40}
            testID="list_view.indicator.loading"
          />
        </View>
      );
    }
  };

  return (
    <View
      style={StyleSheet.flatten([isFullView && { flex: 1 }, containerStyle])}
      testID="list_view"
    >
      {title && (
        <Text.ButtonM
          testID="list_view.title"
          style={{
            marginVertical: spacing.margin.small,
            marginHorizontal: spacing.margin.base,
          }}
        >
          {title}
        </Text.ButtonM>
      )}
      {_renderLoading()}
      <FlatList
        testID="list_view.flat_list"
        showsVerticalScrollIndicator
        ref={listRef}
        data={data}
        style={listStyle}
        horizontal={horizontal}
        renderItem={(item) => _renderItem(item)}
        initialNumToRender={10}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={_renderItemSeparator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyExtractor={(item, index) => (item.id || item._id
          ? `list-${type}-${index}-${item.id || item._id}`
          : _.uniqueId(`list-${type}-${index}`))}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={onRefresh}
              tintColor={colors.gray40}
            />
          ) : undefined
        }
        onEndReached={() => onLoadMore?.()}
        onEndReachedThreshold={onEndReachedThreshold}
        {...props}
      />
      {loadingMore && (
        <ActivityIndicator testID="list_view.indicator.loading_more" />
      )}
    </View>
  );
};

const _ListView = React.forwardRef(
  (props: ListViewProps, ref?: React.Ref<FlatList>) => (
    <ListView listRef={ref} {...props} />
  ),
);

export default React.memo(_ListView);
