import React, {useEffect, Fragment, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {isEmpty} from 'lodash';
import {useFocusEffect} from '@react-navigation/native';

import {ITheme} from '~/theme/interfaces';
import {useUserIdAuth} from '~/hooks/auth';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {groupPrivacy} from '~/constants/privacyTypes';
import groupJoinStatus from '~/constants/groupJoinStatus';
import NoGroupFound from '~/screens/Groups/GroupDetail/components/NoGroupFound';
import GroupContent from '~/screens/Groups/GroupDetail/components/GroupContent';
import {useRootNavigation} from '~/hooks/navigation';

import GroupTopBar from './components/GroupTopBar';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import GroupProfilePlaceholder from '~/beinComponents/placeholder/GroupProfilePlaceholder';
import {deviceDimensions} from '~/theme/dimension';
import GroupPrivateWelcome from './components/GroupPrivateWelcome';
import {rootSwitch} from '~/router/stack';

const GroupDetail = (props: any) => {
  const params = props.route.params;
  const groupId = params?.groupId;

  const [viewWidth, setViewWidth] = useState<number>(deviceDimensions.phone);
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const userId = useUserIdAuth();
  const dispatch = useDispatch();

  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const {privacy} = groupInfo;

  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const isMember = join_status === groupJoinStatus.member;
  const loadingGroupDetail = useKeySelector(
    groupsKeySelector.loadingGroupDetail,
  );
  const loadingPage = useKeySelector(groupsKeySelector.loadingPage);

  const {rootNavigation} = useRootNavigation();

  useFocusEffect(() => {
    if (!userId && Platform.OS === 'web') {
      rootNavigation.replace(rootSwitch.authStack);
    }
  });

  const getGroupDetail = () => {
    dispatch(groupsActions.getGroupDetail(groupId));
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
    dispatch(groupsActions.setLoadingPage(true));
    getGroupDetail();
  }, [groupId]);

  useEffect(() => {
    getGroupPosts();
  }, [groupInfo]);

  const renderGroupContent = () => {
    // visitors can only see "About" of Private group

    if (!isMember && privacy === groupPrivacy.private) {
      return <GroupPrivateWelcome parentWidth={viewWidth} />;
    }

    return (
      <GroupContent getGroupPosts={getGroupPosts} parentWidth={viewWidth} />
    );
  };

  const renderPlaceholder = () => {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.placeholder}>
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
        <View
          style={styles.contentContainer}
          onLayout={event => setViewWidth(event.nativeEvent.layout.width)}>
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

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors, dimension, spacing} = theme;
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
    placeholder: {
      ...Platform.select({
        web: {
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
          alignSelf: 'center',
        },
      }),
    },
  });
};

export default GroupDetail;
