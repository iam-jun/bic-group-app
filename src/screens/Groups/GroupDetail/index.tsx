import {useFocusEffect} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import React, {Fragment, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import GroupProfilePlaceholder from '~/beinComponents/placeholder/GroupProfilePlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {groupPrivacy} from '~/constants/privacyTypes';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {rootSwitch} from '~/router/stack';
import GroupContent from '~/screens/Groups/GroupDetail/components/GroupContent';
import NoGroupFound from '~/screens/Groups/GroupDetail/components/NoGroupFound';
import groupsActions from '~/screens/Groups/redux/actions';
import spacing from '~/theme/spacing';
import groupsKeySelector from '../redux/keySelector';
import GroupPrivateWelcome from './components/GroupPrivateWelcome';
import GroupTopBar from './components/GroupTopBar';

const GroupDetail = (props: any) => {
  const params = props.route.params;
  const groupId = params?.groupId;

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const userId = useUserIdAuth();
  const dispatch = useDispatch();

  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const {privacy} = groupInfo;

  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === groupJoinStatus.member;
  const loadingGroupDetail = useKeySelector(
    groupsKeySelector.loadingGroupDetail,
  );
  const loadingPage = useKeySelector(groupsKeySelector.loadingPage);

  const {rootNavigation} = useRootNavigation();

  useFocusEffect(() => {
    if (!userId) {
      rootNavigation.replace(rootSwitch.authStack);
    }
  });

  const getGroupDetail = () => {
    dispatch(groupsActions.getGroupDetail(groupId, true));
  };

  const getGroupPosts = () => {
    /* Avoid getting group posts of the nonexisting group, 
    which will lead to endless fetching group posts in 
    httpApiRequest > makeGetStreamRequest */
    const privilegeToFetchPost = isMember || privacy === groupPrivacy.public;
    if (loadingGroupDetail || isEmpty(groupInfo) || !privilegeToFetchPost) {
      console.log('[getGroupPosts] stop fetching');
      return;
    }

    dispatch(groupsActions.clearGroupPosts());
    dispatch(groupsActions.getGroupPosts(groupId));
  };

  useEffect(() => {
    getGroupDetail();
  }, [groupId]);

  useEffect(() => {
    getGroupPosts();
  }, [groupInfo]);

  const renderGroupContent = () => {
    // visitors can only see "About" of Private group

    if (!isMember && privacy === groupPrivacy.private) {
      return <GroupPrivateWelcome />;
    }

    return <GroupContent getGroupPosts={getGroupPosts} />;
  };

  const renderPlaceholder = () => {
    return (
      <View style={styles.contentContainer} testID="group_detail.placeholder">
        <View>
          <GroupProfilePlaceholder disableRandom />
          <HeaderCreatePostPlaceholder style={styles.headerCreatePost} />
          <PostViewPlaceholder disableRandom />
          <PostViewPlaceholder disableRandom />
        </View>
      </View>
    );
  };

  const renderGroupDetail = () => {
    if (isEmpty(groupInfo)) return <NoGroupFound />;
    return (
      <Fragment>
        <Header>
          <GroupTopBar />
        </Header>
        <View testID="group_detail.content" style={styles.contentContainer}>
          {renderGroupContent()}
        </View>
      </Fragment>
    );
  };

  // visitors cannot see anything of Secret groups
  // => render No Group Found
  if (!isMember && privacy === groupPrivacy.secret && !loadingPage) {
    return <NoGroupFound />;
  }

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      {loadingPage ? renderPlaceholder() : renderGroupDetail()}
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;
  return StyleSheet.create({
    screenContainer: {
      paddingTop: insets.top,
      backgroundColor: colors.white,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.neutral1,
    },
    headerCreatePost: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
  });
};

export default GroupDetail;
