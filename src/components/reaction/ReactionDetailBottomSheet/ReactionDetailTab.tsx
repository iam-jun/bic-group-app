import React, {
  FC, memo, useCallback, useEffect,
} from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { ReactionType } from '~/constants/reactions';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import spacing from '~/theme/spacing';
import useReactionDetail from './useReactionDetail';

export interface ReactionDetailTabProps {
  reactionType: ReactionType;
  limit?: number;
  height?: number;
  onPressItem?: (item: any) => void;
  getDataParam?: any;
}

const _ReactionDetailTab: FC<ReactionDetailTabProps> = ({
  reactionType,
  limit = 100,
  onPressItem,
  getDataParam,
}: ReactionDetailTabProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const { data = [], loading, getReactionDetail } = useReactionDetail();

  useEffect(
    () => {
      const param = { ...getDataParam, reactionName: reactionType, limit };
      getReactionDetail(param);
    }, [reactionType],
  );

  const _onPressItem = useCallback((item: any) => {
    onPressItem?.(item);
  }, [onPressItem, reactionType, data]);

  const onLoadMore = () => {
    // if (getDataPromise && getDataParam && !!data?.[0]) {
    //   const param = {
    //     ...getDataParam, reactionName: reactionType, limit, latestId: data[data.length - 1].reactionId, order: 'ASC',
    //   };
    //   getDataPromise?.(param)
    //     ?.then?.((_data: any) => {
    //       setData((previousData:any[]) => previousData.concat(_data || []));
    //     })
    //     .catch((e: any) => {
    //       console.error(`\x1b[31m🐣️ ReactionDetailTab get more error ${e}\x1b[0m`);
    //     });
    // }
  };

  const renderItem = (item: any) => (
    <PrimaryItem
      testID={`reaction_detail_bottomSheet.${item?.item?.fullname}`}
      showAvatar
      onPress={() => _onPressItem(item)}
      avatar={item?.item?.avatar}
      avatarProps={{ isRounded: true, style: { marginRight: spacing.margin.small } }}
      title={item?.item?.fullname}
      titleProps={{ color: colors.neutral70, variant: 'bodyMMedium' }}
      subTitle={`@${item?.item?.username}`}
      subTitleProps={{ color: colors.neutral40, variant: 'bodyS' }}
      style={{ paddingHorizontal: spacing.padding.large }}
    />
  );

  const renderFooter = () => {
    if (loading) {
      return <LoadingIndicator />;
    }
    return null;
  };

  const keyExtractor = useCallback((
    item,
  ) => `reaction_tab_detail_${item?.id?.toString?.()}`, [data]);

  return (
    <FlatList
      testID="reaction_detail_bottomSheet.list_user"
      style={styles.listContainer}
      data={data}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      keyExtractor={keyExtractor}
    />
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

const ReactionDetailTab = memo(_ReactionDetailTab);
ReactionDetailTab.whyDidYouRender = true;
export default ReactionDetailTab;
