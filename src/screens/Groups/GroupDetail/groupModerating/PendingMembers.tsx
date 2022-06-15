import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import PendingActionAll from './components/PendingActionAll';
import groupsActions from '../../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import GroupMemberRequest from './components/GroupMemberRequest';

const PendingMembers = (props: any) => {
  const params = props.route.params;
  const {groupId} = params || {};

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const pendingMemberRequests = useKeySelector(
    groupsKeySelector.pendingMemberRequests,
  );
  const {data, loading, canLoadMore, total} = pendingMemberRequests;

  const getData = (isRefreshing?: boolean) => {
    dispatch(groupsActions.getGroupMemberRequests({groupId, isRefreshing}));
  };

  useEffect(() => {
    onRefresh();

    return () => {
      getData(); // to update the total member requests again on press back
    };
  }, [groupId]);

  const onLoadMore = () => {
    getData();
  };

  const onRefresh = () => {
    getData(true);
  };

  const renderItem = ({item}: {item: number}) => {
    return <GroupMemberRequest requestId={item} />;
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

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyScreen
        source={'addUsers'}
        title="groups:text_no_pending_members_notice"
        description="groups:text_pending_request_notice_group"
      />
    );
  };

  return (
    <ScreenWrapper testID="PendingMembers" isFullView>
      <Header title={i18next.t('settings:title_pending_members')} />

      <FlatList
        testID="flatlist"
        style={styles.listStyle}
        data={data}
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

      {data.length > 0 && <PendingActionAll groupId={groupId} />}
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    listStyle: {
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

export default PendingMembers;
