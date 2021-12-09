import React, {useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import Divider from '~/beinComponents/Divider';
import Text from '~/beinComponents/Text';
import PendingUserItem from './components/PendingUserItem';
import {ITheme} from '~/theme/interfaces';
import PendingActionAll from './components/PendingActionAll';
import NoPendingMembers from './components/NoPendingMembers';
import groupsActions from '../../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';

const PendingMembers = (props: any) => {
  const params = props.route.params;
  const {groupId} = params || {};

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const pendingMemberRequests = useKeySelector(
    groupsKeySelector.pendingMemberRequests,
  );
  const {data, loading, canLoadMore} = pendingMemberRequests;
  const totalPendingMembers = useKeySelector(
    groupsKeySelector.groupDetail.total_pending_members,
  );

  useEffect(() => {
    dispatch(groupsActions.getMemberRequests({groupId}));

    return () => {
      dispatch(groupsActions.clearAllMemberRequests());
    };
  }, [groupId]);

  const onLoadMore = () => {
    dispatch(groupsActions.getMemberRequests({groupId}));
  };

  const renderItem = ({item}: {item: number}) => {
    return <PendingUserItem requestId={item} />;
  };

  const renderListHeader = () => {
    return (
      !loading &&
      totalPendingMembers > 0 && (
        <View style={styles.requestHeader}>
          <Text.H5>{`${totalPendingMembers} ${i18next.t(
            'common:text_requests',
          )}`}</Text.H5>
        </View>
      )
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

  return (
    <ScreenWrapper testID="PendingMembers" isFullView>
      <Header title={i18next.t('settings:title_pending_members')} />

      <ListView
        data={data}
        loading={loading}
        style={styles.listStyle}
        isFullView
        renderItem={renderItem}
        onEndReached={onLoadMore}
        ListEmptyComponent={!loading && <NoPendingMembers />}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        renderItemSeparator={() => <Divider style={styles.divider} />}
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
