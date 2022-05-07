import React, {useEffect, useRef, Fragment} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import {isEmpty} from 'lodash';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {ITheme} from '~/theme/interfaces';
import PrivateWelcome from './components/PrivateWelcome';
import actions from '~/screens/Groups/redux/actions';
import PageContent from './components/PageContent';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {groupPrivacy} from '~/constants/privacyTypes';
import groupJoinStatus from '~/constants/groupJoinStatus';
import JoinCancelButton from './components/JoinCancelButton';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import GroupProfilePlaceholder from '~/beinComponents/placeholder/GroupProfilePlaceholder';
import {ICommunity} from '~/interfaces/ICommunity';

const CommunityDetail = (props: any) => {
  const params = props.route.params;
  const communityId = params?.communityId;
  const dispatch = useDispatch();

  const headerRef = useRef<any>();
  const buttonHeight = useRef(250);

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {name, icon, join_status, privacy, group_id} = infoDetail;
  const isPrivate = privacy === groupPrivacy.private;
  const isMember = join_status === groupJoinStatus.member;
  const isGettingInfoDetail = useKeySelector(
    groupsKeySelector.isGettingInfoDetail,
  );
  const loadingPage = useKeySelector(groupsKeySelector.loadingPage);

  const buttonShow = useSharedValue(0);

  const getCommunityDetail = () => {
    dispatch(actions.getCommunityDetail(communityId, true));
  };

  const getPosts = () => {
    /* Avoid getting group posts of the nonexisting group, 
    which will lead to endless fetching group posts in 
    httpApiRequest > makeGetStreamRequest */
    const privilegeToFetchPost =
      isMember ||
      privacy === groupPrivacy.public ||
      privacy === groupPrivacy.open;

    if (isGettingInfoDetail || isEmpty(infoDetail) || !privilegeToFetchPost) {
      console.log('[getPosts] stop fetching');
      return;
    }

    dispatch(actions.clearGroupPosts());
    dispatch(actions.getGroupPosts(group_id));
  };

  useEffect(() => {
    getCommunityDetail();

    return () => {
      dispatch(actions.setCommunityDetail({} as ICommunity));
    };
  }, [communityId]);

  useEffect(() => getPosts(), [infoDetail]);

  const renderPlaceholder = () => {
    return (
      <View
        style={styles.contentContainer}
        testID="community_detail.placeholder">
        <View>
          <GroupProfilePlaceholder disableRandom />
          <HeaderCreatePostPlaceholder style={styles.headerCreatePost} />
          <PostViewPlaceholder disableRandom />
          <PostViewPlaceholder disableRandom />
        </View>
      </View>
    );
  };

  const renderCommunityContent = () => {
    if (!isMember && privacy === groupPrivacy.private) {
      return (
        <PrivateWelcome onScroll={onScroll} onButtonLayout={onButtonLayout} />
      );
    }

    return (
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />
    );
  };

  const onPressChat = () => {
    // TODO: Add navigation to Chat
  };

  const onButtonLayout = (e: any) => {
    // to get the height of the end of button
    buttonHeight.current = e.nativeEvent.layout.height;
  };

  const onScroll = (e: any) => {
    const offsetY = e?.nativeEvent?.contentOffset?.y;
    headerRef?.current?.setScrollY?.(offsetY);
    buttonShow.value = offsetY;
  };

  const buttonStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: '100%',
    bottom: 0,
    opacity: interpolate(
      buttonShow.value,
      [0, buttonHeight.current - 20, buttonHeight.current],
      [0, 0, 1],
    ),
  }));

  const renderCommunityDetail = () => {
    return (
      <Fragment>
        <Header
          headerRef={headerRef}
          title={name}
          avatar={icon}
          useAnimationTitle
          rightIcon="EllipsisV"
          rightIconProps={{backgroundColor: theme.colors.background}}
          onPressChat={isMember || !isPrivate ? onPressChat : undefined}
        />
        <View testID="community_detail.content" style={styles.contentContainer}>
          {renderCommunityContent()}
        </View>
        <Animated.View style={buttonStyle}>
          <JoinCancelButton style={styles.joinBtn} />
        </Animated.View>
      </Fragment>
    );
  };

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      {loadingPage ? renderPlaceholder() : renderCommunityDetail()}
    </ScreenWrapper>
  );
};

export default CommunityDetail;

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    screenContainer: {
      backgroundColor: colors.borderDivider,
    },
    contentContainer: {
      flex: 1,
    },
    joinBtn: {
      paddingTop: spacing.padding.tiny,
    },
    headerCreatePost: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
  });
};
