import React, {useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
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

const GroupDetail = (props: any) => {
  const params = props.route.params;

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {streamClient} = useContext(AppContext);
  const userId = useUserIdAuth();
  const dispatch = useDispatch();
  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const refreshingGroupPosts = useKeySelector(
    groupsKeySelector.refreshingGroupPosts,
  );
  const {id: groupId} = groupInfo;

  const getGroupPosts = () => {
    if (streamClient && userId && groupId) {
      dispatch(groupsActions.getGroupPosts({streamClient, userId, groupId}));
    }
  };

  const getGroupDetail = () => {
    if (groupId) {
      dispatch(groupsActions.getGroupDetail(groupId));
    }
  };

  const getGroupMembers = () => {
    dispatch(groupsActions.clearGroupMembers());
    if (groupId) {
      dispatch(groupsActions.getGroupMembers(groupId));
    }
  };

  const _onRefresh = () => {
    getGroupDetail();
    getGroupPosts();
    getGroupMembers();
  };

  useEffect(() => {
    getGroupPosts();
  }, []);

  return (
    <View style={styles.screenContainer}>
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
        style={styles.scrollView}>
        <GroupInfoHeader {...params} />
        <TabMenu
          data={groupProfileTabs}
          menuInactiveTintColor={theme.colors.textSecondary}
        />
      </ScrollView>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;
  return StyleSheet.create({
    screenContainer: {
      paddingTop: insets.top,
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.bgDisable,
    },
  });
};

export default GroupDetail;
