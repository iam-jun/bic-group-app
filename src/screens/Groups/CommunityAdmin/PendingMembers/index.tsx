import {View, Text, StyleSheet, FlatList} from 'react-native';
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
import PendingUserItem from '../../GroupDetail/groupModerating/components/PendingUserItem';

const CommunityPendingMembers = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {id: communityId} = useKeySelector(groupsKeySelector.communityDetail);

  // useEffect(() => {
  //   dispatch(groupsActions.getMemberRequests({communityId}));
  //   dispatch(groupsActions.getGroupDetail(communityId)); // need to update total pending requests

  //   return () => {
  //     dispatch(groupsActions.resetMemberRequests());
  //     dispatch(groupsActions.getGroupDetail(communityId));
  //   };
  // }, [communityId]);

  const onLoadMore = () => {
    // dispatch(groupsActions.getMemberRequests({groupId}));
  };

  const renderItem = ({item}: {item: number}) => {
    // return <PendingUserItem requestId={item} />;
  };

  return (
    <ScreenWrapper testID="CommunityPendingMembers" isFullView>
      <Header title={i18next.t('settings:title_pending_members')} />

      <FlatList />
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({});
};

export default CommunityPendingMembers;
