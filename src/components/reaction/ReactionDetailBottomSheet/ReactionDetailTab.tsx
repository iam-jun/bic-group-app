import React, {
  FC, memo, useCallback, useEffect,
} from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { ReactionType } from '~/constants/reactions';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import spacing from '~/theme/spacing';
import useReactionDetailStore from './store';
import IReactionDetailState from './store/Interface';
import { IParamGetReactionDetail } from '~/interfaces/IPost';

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

  const data = useReactionDetailStore((state:IReactionDetailState) => state.data) || [];
  const loading = useReactionDetailStore((state:IReactionDetailState) => state.loading);
  const doGetReactionDetail = useReactionDetailStore((state:IReactionDetailState) => state.doGetReactionDetail);
  const doLoadMoreReactionDetail = useReactionDetailStore(
    (state: IReactionDetailState) => state.doLoadMoreReactionDetail,
  );
  const canLoadMore = useReactionDetailStore((state: IReactionDetailState) => state.canLoadMore);
  const reset = useReactionDetailStore((state: IReactionDetailState) => state.reset);

  useEffect(
    () => {
      const param = { ...getDataParam, reactionName: reactionType, limit };
      doGetReactionDetail(param);
      return () => {
        reset();
      };
    }, [reactionType],
  );

  const _onPressItem = useCallback((item: any) => {
    onPressItem?.(item);
  }, [onPressItem, reactionType]);

  const onLoadMore = () => {
    if (!!data?.[0] && canLoadMore) {
      const param = {
        ...getDataParam, reactionName: reactionType, limit, latestId: data[data.length - 1].reactionId, order: 'ASC',
      } as IParamGetReactionDetail;
      doLoadMoreReactionDetail(param);
    }
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

  const keyExtractor = (
    item,
  ) => `reaction_tab_detail_${item?.id?.toString?.()}`;

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
export default ReactionDetailTab;
