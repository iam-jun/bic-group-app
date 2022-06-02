import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';
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

const CommunityPendingMembers = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {id: communityId} = useKeySelector(groupsKeySelector.communityDetail);
  const {total, loading, canLoadMore, data, items} = useKeySelector(
    groupsKeySelector.communityMemberRequests,
  );

  useEffect(() => {
    getData();
    dispatch(groupsActions.getCommunityDetail(communityId)); // need to update total pending requests

    return () => {
      resetData();
      dispatch(groupsActions.getCommunityDetail(communityId));
    };
  }, [communityId]);

  const getData = () => {
    dispatch(groupsActions.getCommunityMemberRequests({communityId}));
  };

  const resetData = () => {
    dispatch(groupsActions.resetCommunityMemberRequests());
  };

  const onLoadMore = () => {
    getData();
  };

  const onRefresh = () => {
    resetData();
    getData();
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
        <Text.H5>{`${total} ${i18next.t('common:text_request', {
          count: total,
        })}`}</Text.H5>
      </View>
    );
  };

  const renderItem = ({item}: {item: number}) => {
    const currentItem = items[item];
    // return <PendingUserItem requestId={item} />;
  };

  const renderListFooter = () => {
    return (
      !loading &&
      canLoadMore &&
      data.length > 0 && (
        <View style={styles.listFooter}>
          <ActivityIndicator />
        </View>
      )
    );
  };

  return (
    <ScreenWrapper testID="CommunityPendingMembers" isFullView>
      <Header title={i18next.t('settings:title_pending_members')} />

      <FlatList
        testID="flatlist"
        style={styles.flatList}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `requests_${item}_${index}`}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
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
