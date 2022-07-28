import React, { FC, useEffect, useState } from 'react';
import {
  View, StyleSheet, Dimensions, FlatList,
} from 'react-native';

import { ReactionType } from '~/constants/reactions';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import spacing from '~/theme/spacing';
import { IReaction } from '~/interfaces/IPost';

export interface ReactionDetailTabProps {
  reactionType: ReactionType;
  limit?: number;
  height?: number;
  onPressItem?: (item: any) => void;

  getDataPromise?: any;
  getDataParam?: any;
}

const screenHeight = Dimensions.get('window').height;
const contentBarHeight = 0.6 * screenHeight;

const ReactionDetailTab: FC<ReactionDetailTabProps> = ({
  reactionType,
  limit = 1,
  height = contentBarHeight,
  onPressItem,
  getDataPromise,
  getDataParam,
}: ReactionDetailTabProps) => {
  const [data, setData] = useState<IReaction[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    if (getDataPromise && getDataParam) {
      setLoading(true);
      const param = { ...getDataParam, reactionName: reactionType, limit };
      getDataPromise?.(param)
        ?.then?.((data: any) => {
          setData(data || []);
          setLoading(false);
        })
        .catch((e: any) => {
          console.log(`\x1b[31m🐣️ ReactionDetailTab get error ${e}\x1b[0m`);
          setLoading(false);
        });
    }
  };

  useEffect(
    () => {
      setData([]);
      getData();
    }, [reactionType],
  );

  const _onPressItem = (item: any) => {
    onPressItem?.(item);
  };

  const onLoadMore = () => {
    if (getDataPromise && getDataParam && !!data?.[0]) {
      const param = {
        ...getDataParam, reactionName: reactionType, limit, latestId: data[data.length - 1].reactionId, order: 'ASC',
      };
      getDataPromise?.(param)
        ?.then?.((_data: any) => {
          setData(data.concat(_data || []));
        })
        .catch((e: any) => {
          console.log(`\x1b[31m🐣️ ReactionDetailTab get more error ${e}\x1b[0m`);
        });
    }
  }

  const renderItem = (item: any) => (
    <PrimaryItem
      testID={`reaction_detail_bottomSheet.${item?.item?.fullname}`}
      showAvatar
      height={44}
      onPress={() => _onPressItem(item)}
      avatar={item?.item?.avatar}
      title={item?.item?.fullname}
    />
  );

  const renderFooter = () => {
    if (loading) {
      return <LoadingIndicator />;
    }
    return null;
  };

  const renderHeader = () => <View style={styles.header} />;

  return (
    <View style={{ height: 100 }}>
      <FlatList
        testID="reaction_detail_bottomSheet.list_user"
        style={styles.listContainer}
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: spacing.padding.tiny,
  },
  header: {
    paddingTop: spacing.padding.tiny,
  },
});

export default ReactionDetailTab;
