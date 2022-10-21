import {
  useFocusEffect,
  ExtendedTheme,
  useTheme,
} from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  DeviceEventEmitter, Share, StyleSheet, View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';

import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import GroupProfilePlaceholder from '~/beinComponents/placeholder/GroupProfilePlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useAuth, { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { useMyPermissions } from '~/hooks/permissions';
import { useKeySelector } from '~/hooks/selector';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { rootSwitch } from '~/router/stack';
import GroupContent from '~/screens/groups/GroupDetail/components/GroupContent';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import {
  formatChannelLink, getGroupLink, openUrl,
} from '~/utils/link';
import { checkLastAdmin } from '../helper';
import groupsKeySelector from '../../../storeRedux/groups/keySelector';
import GroupPrivateWelcome from './components/GroupPrivateWelcome';
import useLeaveGroup from '../GroupMembers/components/useLeaveGroup';
import GroupTabHeader from './components/GroupTabHeader';
import { useBaseHook } from '~/hooks';
import GroupJoinCancelButton from './components/GroupJoinCancelButton';
import { getHeaderMenu } from '~/screens/communities/CommunityDetail/helper';
import { BottomListProps } from '~/components/BottomList';
import NotFound from '~/screens/NotFound/components/NotFound';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import useTimelineStore, { ITimelineState } from '~/store/timeline';

const GroupDetail = (props: any) => {
  const { params } = props.route;
  const { groupId, onGoBack } = params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const { user } = useAuth();
  const userId = useUserIdAuth();
  const dispatch = useDispatch();
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);

  const headerRef = useRef<any>();
  const [groupInfoHeight, setGroupInfoHeight] = useState(300);

  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const { name, privacy, id: idCurrentGroupDetail } = groupInfo;
  const communityId = useCommunitiesStore((state: ICommunitiesState) => state.currentCommunityId);
  const communityDetail = useCommunitiesStore((state: ICommunitiesState) => state.data[communityId]);
  const { name: communityName, joinStatus: joinStatusCommunity }
    = communityDetail || {};
  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === GroupJoinStatus.MEMBER;
  const isMemberCommunity = joinStatusCommunity === GroupJoinStatus.MEMBER;
  const isLoadingGroupDetailError = useKeySelector(
    groupsKeySelector.isLoadingGroupDetailError,
  );
  const loadingGroupDetail = useKeySelector(
    groupsKeySelector.loadingGroupDetail,
  );

  // Temporarily comment this snippet code
  // Because old data will show up before being replaced by new data
  // This is considered a bug by tester
  // const isLoadingGroup = useKeySelector(groupsKeySelector.loadingPage);
  // const hasNoDataInStore = !groupInfo;
  // const shouldShowPlaceholder = hasNoDataInStore && isLoadingGroup;

  const shouldShowPlaceholder = idCurrentGroupDetail !== groupId;

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canSetting = hasPermissionsOnScopeWithId('groups', groupId, [
    PERMISSION_KEY.GROUP.EDIT_GROUP_INFO,
    PERMISSION_KEY.GROUP.EDIT_GROUP_PRIVACY,
  ]);
  const showPrivate
    = !isMember
    && (privacy === GroupPrivacyType.PRIVATE
      || (!isMemberCommunity && privacy === GroupPrivacyType.OPEN));

  const timelineActions = useTimelineStore((state: ITimelineState) => state.actions);
  const groupPost = useTimelineStore((state: ITimelineState) => state.items[groupId]);

  const buttonShow = useSharedValue(0);
  const containerPaddingBottom = useSharedValue(0);
  const heightButtonBottom = useSharedValue(0);

  useFocusEffect(() => {
    if (!userId) {
      rootNavigation.replace(rootSwitch.authStack);
    }
  });

  const getGroupDetail = () => {
    dispatch(
      groupsActions.getGroupDetail({
        groupId,
        loadingPage: true,
      }),
    );
  };

  const getGroupPosts = useCallback(() => {
    /* Avoid getting group posts of the nonexisting group,
    which will lead to endless fetching group posts in
    httpApiRequest > makeGetStreamRequest */
    const privilegeToFetchPost
      = isMember
      || privacy === GroupPrivacyType.PUBLIC
      || privacy === GroupPrivacyType.OPEN;

    if (loadingGroupDetail || isEmpty(groupInfo) || !privilegeToFetchPost) {
      return;
    }

    // dispatch(groupsActions.clearGroupPosts());
    timelineActions.resetTimeline(groupId);
    timelineActions.getPosts(groupId);
  }, [groupId, isMember, privacy, loadingGroupDetail, groupInfo]);

  useEffect(() => {
    getGroupDetail();
    if (communityId && communityId !== communityDetail?.id) {
      actions.getCommunity(communityId);
    }
  }, [groupId]);

  useEffect(() => {
    if (isEmpty(groupPost?.ids)) { getGroupPosts(); }
  }, [groupInfo]);

  const onPressAdminTools = () => {
    dispatch(modalActions.hideBottomList());
    rootNavigation.navigate(groupStack.groupAdmin, { groupId });
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideBottomList());
    Clipboard.setString(getGroupLink({ communityId: communityDetail?.id, groupId }));
    dispatch(
      modalActions.showHideToastMessage({
        content: 'common:text_link_copied_to_clipboard',
      }),
    );
  };

  const onPressShare = () => {
    dispatch(modalActions.hideBottomList());
    const groupLink = getGroupLink({ communityId: communityDetail?.id, groupId });
    try {
      Share.share({ message: groupLink, url: groupLink });
    } catch (error) {
      console.error(`\x1b[31m🐣️ Share group error: ${error}\x1b[0m`);
    }
  };

  const alertLeaveGroup = useLeaveGroup({
    groupId,
    username: user?.username,
  });

  const navigateToMembers = () => {
    dispatch(modalActions.clearToastMessage());
    rootNavigation.navigate(groupStack.groupMembers, { groupId });
  };

  const onPressLeave = () => {
    dispatch(modalActions.hideBottomList());

    return checkLastAdmin(
      groupId,
      userId,
      dispatch,
      alertLeaveGroup,
      navigateToMembers,
    );
  };

  const onGetInfoLayout = useCallback((e: any) => {
    // to get the height from the start of the cover image to the end of group info
    setGroupInfoHeight(e.nativeEvent.layout.height);
  }, []);

  const scrollWrapper = (offsetY: number) => {
    headerRef?.current?.setScrollY?.(offsetY);
    DeviceEventEmitter.emit('stopAllVideo');
  };

  const onScrollHandler = useAnimatedScrollHandler((event: any) => {
    const offsetY = event?.contentOffset?.y;
    runOnJS(scrollWrapper)(offsetY);
    buttonShow.value = offsetY;
  });

  const onButtonBottomLayout = (e: any) => {
    heightButtonBottom.value = e.nativeEvent.layout.height;
  };

  const containerAnimation = useAnimatedStyle(() => ({
    paddingBottom: containerPaddingBottom.value,
  }));

  const buttonStyle = useAnimatedStyle(() => {
    const value = interpolate(
      buttonShow.value,
      [0, groupInfoHeight - 20, groupInfoHeight],
      [0, 0, 1],
    );

    if (value < 1) {
      containerPaddingBottom.value = 0;
    }

    if (value >= 1) {
      containerPaddingBottom.value = heightButtonBottom.value;
    }

    return {
      opacity: value,
    };
  }, [groupInfoHeight]);

  const onPressMenu = () => {
    const headerMenuData = getHeaderMenu({
      type: 'group',
      isMember,
      canSetting,
      dispatch,
      onPressAdminTools,
      onPressCopyLink,
      onPressShare,
      onPressLeave,
    });
    dispatch(modalActions.showBottomList({
      isOpen: true,
      data: headerMenuData,
    } as BottomListProps));
  };

  const onPressChat = () => {
    const link = formatChannelLink(groupInfo.teamName || groupInfo.team_name, groupInfo.slug);
    openUrl(link);
  };

  const onGoBackOnNotFound = () => {
    // clear all state
    dispatch(groupsActions.setGroupDetail(null));
  };

  const renderGroupContent = () => {
    // visitors can only see "About" of Private group

    if (showPrivate) {
      return (
        <GroupPrivateWelcome
          onScroll={onScrollHandler}
          onGetInfoLayout={onGetInfoLayout}
          infoDetail={groupInfo}
          isMember={isMember}
          communityName={communityName}
        />
      );
    }

    return (
      <GroupContent
        onScroll={onScrollHandler}
        onGetInfoLayout={onGetInfoLayout}
      />
    );
  };

  const renderPlaceholder = () => (
    <View style={styles.contentContainer} testID="group_detail.placeholder">
      <View>
        <GroupProfilePlaceholder disableRandom />
        <HeaderCreatePostPlaceholder style={styles.headerCreatePost} />
        <PostViewPlaceholder disableRandom />
        <PostViewPlaceholder disableRandom />
      </View>
    </View>
  );

  const renderGroupDetail = () => {
    if (isLoadingGroupDetailError) return <NotFound testID="no_group_found" onGoBack={onGoBackOnNotFound} />;

    return (
      <>
        <Header
          headerRef={headerRef}
          title={name}
          subTitle={`${t('groups:text_in')} ${communityName}`}
          subTitleTextProps={{ variant: 'subtitleXS', numberOfLines: 1 }}
          useAnimationTitle
          rightIcon={canSetting ? 'iconShieldStar' : 'menu'}
          onPressChat={isMember ? onPressChat : undefined}
          onRightPress={onPressMenu}
          showStickyHeight={groupInfoHeight}
          stickyHeaderComponent={
            !showPrivate && (
              <GroupTabHeader
                groupId={groupId}
                isMemberCommunity={isMemberCommunity}
                isMember={isMember}
                communityId={communityId}
                teamName={groupInfo.teamName}
              />
            )
          }
          onPressBack={onGoBack}
        />
        <Animated.View testID="group_detail.content" style={[styles.contentContainer, containerAnimation]}>
          {renderGroupContent()}
        </Animated.View>
        <Animated.View onLayout={onButtonBottomLayout} style={[styles.button, buttonStyle]}>
          <GroupJoinCancelButton style={styles.joinBtn} />
        </Animated.View>

      </>
    );
  };

  return (
    <View style={styles.screenContainer}>
      {shouldShowPlaceholder ? renderPlaceholder() : renderGroupDetail()}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: colors.neutral5,
    },
    contentContainer: {
      flex: 1,
    },
    headerCreatePost: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
    button: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
    },
    joinBtn: {
      paddingBottom: spacing.padding.large + insets.bottom,
      paddingTop: spacing.padding.large,
    },
  });
};

export default GroupDetail;
