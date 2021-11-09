import _ from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import items, {IListViewItem} from '~/beinComponents/list/items';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {appScreens} from '~/configs/navigator';
import {IAction} from '~/constants/commonActions';

import {spacing} from '~/theme';
import {ITheme} from '~/theme/interfaces';
import loadings from '../../components/list/loadings';

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
  onActionPress,
  onRefresh,
  onLoadMore,

  titleField,
  subTitleField,
  onEndReachedThreshold = 0.1,

  renderItem,
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
  const {colors} = useTheme() as ITheme;

  const ItemComponent = items[type] || PrimaryItem;
  const LoadingPlaceholder = loadings[type];

  const _renderItem = ({item, index}: {item: any; index: number}) => {
    if (renderItem) {
      return renderItem({item, index});
    }

    let itemPath = '';
    let isActive = false;

    switch (type) {
      case 'conversation':
        itemPath = item['_id'];
        break;

      case 'menu':
        itemPath = item['path'];
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
        disabled={!onItemPress || item.disableClick}
        onPress={(e: any) => onItemPress && onItemPress(item, e)}
        onLongPress={(e: any) => onItemLongPress && onItemLongPress(item, e)}>
        <ItemComponent
          {...item}
          title={item[titleField || 'title']}
          subTitle={item[subTitleField || 'subTitle']}
          style={itemStyle}
          onActionPress={
            onActionPress
              ? (action: IAction) => onActionPress(action, item)
              : undefined
          }
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
    } else if (renderItemSeparator) {
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
          <View>
            {Array.from(Array(10).keys()).map(item => (
              <LoadingPlaceholder key={`loading_placeholder_${item}`} />
            ))}
          </View>
        );
      }
      return (
        <View style={{marginTop: spacing.margin.large}}>
          <ActivityIndicator color={colors.borderDisable} />
        </View>
      );
    }
  };

  return (
    <View style={StyleSheet.flatten([isFullView && {flex: 1}, containerStyle])}>
      {title && (
        <Text.ButtonBase
          style={{
            marginVertical: spacing.margin.small,
            marginHorizontal: spacing.margin.base,
          }}>
          {title}
        </Text.ButtonBase>
      )}
      {_renderLoading()}
      <FlatList
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        ref={listRef}
        data={data}
        style={listStyle}
        horizontal={horizontal}
        renderItem={item => _renderItem(item)}
        initialNumToRender={10}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={_renderItemSeparator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyExtractor={(item, index) =>
          item.id || item._id
            ? `list-${type}-${index}-${item.id || item._id}`
            : _.uniqueId(`list-${type}-${index}`)
        }
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={onRefresh}
              tintColor={colors.borderDisable}
            />
          ) : undefined
        }
        onEndReached={() => onLoadMore?.()}
        onEndReachedThreshold={onEndReachedThreshold}
        {...props}
      />
      {loadingMore && <ActivityIndicator />}
    </View>
  );
};

const _ListView = React.forwardRef(
  (props: ListViewProps, ref?: React.Ref<FlatList>) => (
    <ListView listRef={ref} {...props} />
  ),
);

export default React.memo(_ListView);
