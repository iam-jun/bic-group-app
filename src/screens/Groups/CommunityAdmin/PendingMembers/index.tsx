import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import groupsActions from '../../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import Text from '~/beinComponents/Text';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import Divider from '~/beinComponents/Divider';
import CommunityMemberRequest from './CommunityMemberRequest';
import ApproveDeclineAllRequests from './ApproveDeclineAllRequests';
import {useBaseHook} from '~/hooks';

const CommunityPendingMembers = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {id: communityId} = useKeySelector(groupsKeySelector.communityDetail);
  const {total, loading, canLoadMore, ids} = useKeySelector(
    groupsKeySelector.communityMemberRequests,
  );

  useEffect(() => {
    onRefresh();

    return () => {
      getData(); // to update the total member requests again on press back
    };
  }, [communityId]);

  const getData = (isRefreshing?: boolean) => {
    dispatch(
      groupsActions.getCommunityMemberRequests({communityId, isRefreshing}),
    );
  };

  const onLoadMore = () => {
    getData();
  };

  const onRefresh = () => {
    getData(true);
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        source={'addUsers'}
        title="groups:text_no_pending_members_notice"
        description="groups:text_pending_request_notice_community"
      />
    );
  };

  const renderListHeader = () => {
    if (loading || total === 0) return null;
    return (
      <View style={styles.requestHeader}>
        <Text.H5 testID="community_pending_members.request_title">{`${total} ${t(
          'common:text_request',
          {
            count: total,
          },
        )}`}</Text.H5>
      </View>
    );
  };

  const renderItem = ({item}: {item: number}) => {
    return <CommunityMemberRequest requestId={item} />;
  };

  const renderListFooter = () => {
    return (
      !loading &&
      canLoadMore &&
      ids.length > 0 && (
        <View
          style={styles.listFooter}
          testID="community_pending_members.loading_more_indicator">
          <ActivityIndicator />
        </View>
      )
    );
  };

  return (
    <ScreenWrapper testID="CommunityPendingMembers" isFullView>
      <Header title={t('settings:title_pending_members')} />

      <FlatList
        testID="flatlist"
        style={styles.flatList}
        data={ids}
        renderItem={renderItem}
        keyExtractor={(item, index) => `requests_${item}_${index}`}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={theme.colors.borderDisable}
          />
        }
      />

      {ids.length > 0 && <ApproveDeclineAllRequests />}
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    flatList: {
      marginHorizontal: spacing.margin.large,
    },
    requestHeader: {
      marginVertical: spacing.margin.base,
    },
    divider: {
      marginBottom: spacing.margin.small,
    },
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default CommunityPendingMembers;
