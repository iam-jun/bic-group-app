import React, {useEffect, useContext, Fragment} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {groupPrivacy} from '~/constants/privacyTypes';
import groupJoinStatus from '~/constants/groupJoinStatus';
import NoGroupFound from '~/screens/Groups/GroupDetail/components/NoGroupFound';
import GroupContent from '~/screens/Groups/GroupDetail/components/GroupContent';

import GroupAboutContent from '../components/GroupAboutContent';
import GroupTopBar from './components/GroupTopBar';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import GroupProfilePlaceholder from '~/beinComponents/placeholder/GroupProfilePlaceholder';
import {isEmpty} from 'lodash';

const GroupDetail = (props: any) => {
  const params = props.route.params;
  const groupId = params?.groupId;

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {streamClient} = useContext(AppContext);
  const userId = useUserIdAuth();
  const dispatch = useDispatch();

  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const {privacy} = groupInfo;

  const refreshingGroupPosts = useKeySelector(
    groupsKeySelector.refreshingGroupPosts,
  );
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const loadingGroupDetail = useKeySelector(
    groupsKeySelector.loadingGroupDetail,
  );

  const getGroupDetail = () => dispatch(groupsActions.getGroupDetail(groupId));

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

  const renderPlaceholder = () => {
    return (
      <View>
        <GroupProfilePlaceholder disableRandom />
        <HeaderCreatePostPlaceholder style={styles.headerCreatePost} />
        <PostViewPlaceholder disableRandom />
        <PostViewPlaceholder disableRandom />
      </View>
    );
  };

  const _onRefresh = () => {
    if (groupId) {
      getGroupDetail();

      // Avoid getting group posts of the nonexisting group, which will lead to endless fetching group posts in httpApiRequest > makeGetStreamRequest
      if (!loadingGroupDetail && !isEmpty(groupInfo)) {
        getGroupPosts();
      }
    }
  };

  useEffect(() => {
    _onRefresh();
  }, [groupId]);

  // visitors cannot see anything of Secret groups
  // => render No Group Found
  if (
    join_status !== groupJoinStatus.member &&
    privacy === groupPrivacy.secret &&
    !refreshingGroupPosts
  ) {
    return <NoGroupFound />;
  }

  if (
    join_status !== groupJoinStatus.member &&
    privacy === groupPrivacy.private
  ) {
    return <GroupAboutContent />;
  }

  const renderGroupDetail = () => {
    if (isEmpty(groupInfo)) return <NoGroupFound />;
    return (
      <Fragment>
        <Header>
          <GroupTopBar />
        </Header>
        <View style={styles.contentContainer}>
          <GroupContent />
        </View>
      </Fragment>
    );
  };

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      {refreshingGroupPosts || loadingGroupDetail
        ? renderPlaceholder()
        : renderGroupDetail()}
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors, spacing} = theme;
  return StyleSheet.create({
    screenContainer: {
      paddingTop: insets.top,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.bgSecondary,
    },
    headerCreatePost: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
  });
};

export default GroupDetail;
