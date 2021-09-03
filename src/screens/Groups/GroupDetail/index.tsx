import React, {useEffect, useContext} from 'react';
import {StyleSheet, ScrollView, RefreshControl, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

import TabMenu from '~/beinComponents/Tab';
import {ITheme} from '~/theme/interfaces';
import GroupInfoHeader from './components/GroupInfoHeader';
import GroupTopBar from './components/GroupTopBar';
import groupProfileTabs from './GroupProfileTabs';
import Header from '~/beinComponents/Header';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import GroupAbout from './components/GroupAbout';
import {groupPrivacy} from '~/constants/privacyTypes';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import groupJoinStatus from '~/constants/groupJoinStatus';
import NoGroupFound from '~/screens/Groups/GroupDetail/components/NoGroupFound';

const GroupDetail = (props: any) => {
  const params = props.route.params;
  const groupId = params?.groupId;

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {streamClient} = useContext(AppContext);
  const userId = useUserIdAuth();
  const dispatch = useDispatch();
  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const refreshingGroupPosts = useKeySelector(
    groupsKeySelector.refreshingGroupPosts,
  );
  const {privacy} = groupInfo;
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);

  const getGroupPosts = () => {
    dispatch(groupsActions.clearGroupPosts());
    if (streamClient && userId) {
      dispatch(
        groupsActions.getGroupPosts({
          streamClient,
          userId,
          groupId: groupId,
        }),
      );
    }
  };

  const getGroupDetail = () => {
    dispatch(groupsActions.getGroupDetail(groupId));
  };

  const getGroupMembers = () => {
    dispatch(groupsActions.clearGroupMembers());
    dispatch(groupsActions.getGroupMembers({groupId}));
  };

  const _onRefresh = () => {
    if (groupId) {
      getGroupDetail();
      getGroupPosts();
      getGroupMembers();
    }
  };

  useEffect(() => {
    _onRefresh();
  }, [groupId]);

  const renderGroupContent = () => {
    // visitors can only see "About" of Private group
    if (
      join_status !== groupJoinStatus.member &&
      privacy === groupPrivacy.private
    ) {
      return <GroupAbout />;
    }

    return (
      <TabMenu
        data={groupProfileTabs}
        menuInactiveTintColor={theme.colors.textSecondary}
      />
    );
  };

  // visitors cannot see anything of Secret groups
  // => render No Group Found
  if (
    join_status !== groupJoinStatus.member &&
    privacy === groupPrivacy.secret &&
    !refreshingGroupPosts
  ) {
    return <NoGroupFound />;
  }

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      <Header>
        <GroupTopBar />
      </Header>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={!!refreshingGroupPosts}
            onRefresh={_onRefresh}
            tintColor={theme.colors.borderDisable}
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <GroupInfoHeader />
        {renderGroupContent()}
      </ScrollView>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;
  return StyleSheet.create({
    screenContainer: {
      paddingTop: insets.top,
      backgroundColor: colors.background,
    },
    scrollView: {
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.bgDisable,
    },
  });
};

export default GroupDetail;
