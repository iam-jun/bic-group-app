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
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import useMyPermissionsStore from '~/store/permissions';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { rootSwitch } from '~/router/stack';
import useAuthController, { IAuthState } from '~/screens/auth/store';
import GroupContent from '~/screens/groups/GroupDetail/components/GroupContent';
import spacing from '~/theme/spacing';
import {
  formatChannelLink, getGroupLink, openUrl,
} from '~/utils/link';
import GroupPrivateWelcome from './components/GroupPrivateWelcome';
import useLeaveGroup from './hooks/useLeaveGroup';
import GroupTabHeader from './components/GroupTabHeader';
import { useBaseHook } from '~/hooks';
import GroupJoinCancelButton from './components/GroupJoinCancelButton';
import { getHeaderMenu } from '~/screens/communities/CommunityDetail/helper';
import { BottomListProps } from '~/components/BottomList';
import NotFound from '~/screens/NotFound/components/NotFound';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import useTimelineStore, { ITimelineState } from '~/store/timeline';
import ContentSearch from '~/screens/Home/HomeSearch';
import FilterFeedButtonGroup from '~/beinComponents/FilterFeedButtonGroup';
import { PermissionKey } from '~/constants/permissionScheme';
import useGroupDetailStore from './store';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';
import useModalStore from '~/store/modal';
import useFeedSearchStore from '~/screens/Home/HomeSearch/store';
import usePinContentStore from '~/components/PinContent/store';

const GroupDetail = (props: any) => {
  const { params } = props.route;
  const { groupId, onGoBack, communityId: paramCommunityId } = params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const user = useAuthController(useCallback((state: IAuthState) => state.authUser, []));
  const userId = useUserIdAuth();
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);
  const {
    isLoadingGroupDetailError,
    loadingGroupDetail,
    actions: { getGroupDetail },
  } = useGroupDetailStore((state) => state);
  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group: groupInfo, joinStatus } = groups[currentGroupId] || {};
  const {
    name, privacy, teamName, slug,
  } = groupInfo || {};
  const modalActions = useModalStore((state) => state.actions);

  const headerRef = useRef<any>();
  const [groupInfoHeight, setGroupInfoHeight] = useState(300);

  const currentCommunityId = useCommunitiesStore((state: ICommunitiesState) => state.currentCommunityId);
  const communityId = paramCommunityId || currentCommunityId;
  const communityDetail = useCommunitiesStore(
    useCallback((state: ICommunitiesState) => state.data[communityId], [communityId, groupId]),
  );
  const { name: communityName, joinStatus: joinStatusCommunity }
    = communityDetail || {};
  const isMember = joinStatus === GroupJoinStatus.MEMBER;
  const isMemberCommunity = joinStatusCommunity === GroupJoinStatus.MEMBER;

  // Temporarily comment this snippet code
  // Because old data will show up before being replaced by new data
  // This is considered a bug by tester
  // const isLoadingGroup = useKeySelector(groupsKeySelector.loadingPage);
  // const hasNoDataInStore = !groupInfo;
  // const shouldShowPlaceholder = hasNoDataInStore && isLoadingGroup;

  const shouldShowPlaceholder = currentGroupId !== groupId && !isLoadingGroupDetailError;

  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canSetting = shouldHavePermission(groupId, [
    PermissionKey.ROLE_COMMUNITY_OWNER,
    PermissionKey.ROLE_COMMUNITY_ADMIN,
    PermissionKey.ROLE_GROUP_ADMIN,
  ]);
  const showPrivate
    = !isMember
    && (privacy === GroupPrivacyType.PRIVATE
      || (!isMemberCommunity && privacy === GroupPrivacyType.CLOSED));

  // post
  const timelineActions = useTimelineStore((state: ITimelineState) => state.actions);
  const { timelines } = useTimelineStore();
  const { contentFilter, attributeFilter } = timelines?.[groupId] || {};
  const groupPost = useTimelineStore(
    useCallback((state: ITimelineState) => state.timelines?.[groupId]?.data?.[contentFilter]?.[attributeFilter], [
      groupId,
      contentFilter,
      attributeFilter,
    ]),
  );

  const actionsFeedSearch = useFeedSearchStore((state) => state.actions);
  const actionPinContent = usePinContentStore((state) => state.actions);

  const buttonShow = useSharedValue(0);
  const containerPaddingBottom = useSharedValue(0);
  const heightButtonBottom = useSharedValue(0);

  useFocusEffect(() => {
    if (!userId) {
      rootNavigation.replace(rootSwitch.authStack);
    }
  });

  const getGroupPosts = useCallback(() => {
    /* Avoid getting group posts of the nonexisting group,
    which will lead to endless fetching group posts in
    httpApiRequest > makeGetStreamRequest */
    const privilegeToFetchPost
      = isMember
      || privacy === GroupPrivacyType.OPEN
      || privacy === GroupPrivacyType.CLOSED;

    if (loadingGroupDetail || isEmpty(groupInfo) || !privilegeToFetchPost) {
      return;
    }

    // dispatch(groupsActions.clearGroupPosts());
    timelineActions.getPosts(groupId);
  }, [groupId, isMember, privacy, loadingGroupDetail, groupInfo, contentFilter, attributeFilter]);

  useEffect(() => {
    // Avoid empty object
    if (!communityDetail?.id) {
      actions.getCommunity(communityId);
    }
    getGroupDetail({ groupId });
  }, [groupId]);

  useEffect(() => () => {
    useGroupsStore.setState({
      currentGroupId: '',
    });
  }, []);

  useEffect(() => {
    if (isEmpty(timelines[groupId]) && isEmpty(groupPost?.ids)) {
      // for the 1st time timelines[groupId] can be undefined so we must init Data
      if (groupId) timelineActions.initDataTimeline(groupId);
    }
  }, [groupInfo]);

  useEffect(() => {
    getGroupPosts();
  }, [contentFilter, attributeFilter, groupInfo]);

  useEffect(() => () => {
    if (groupId) timelineActions.resetTimeline(groupId);
  }, [groupId]);

  useEffect(() => {
    if (groupId) actionPinContent.getPinContentsGroup(groupId);
  }, [groupId]);

  useEffect(() => () => {
    if (groupId) actionPinContent.resetDataPinContentsGroup(groupId);
  }, [groupId]);

  const onPressAdminTools = () => {
    modalActions.hideBottomList();
    rootNavigation.navigate(groupStack.groupAdmin, { groupId });
  };

  const onPressCopyLink = () => {
    modalActions.hideBottomList();
    Clipboard.setString(getGroupLink({ communityId: communityDetail?.id, groupId }));
    modalActions.showToast({ content: 'common:text_link_copied_to_clipboard' });
  };

  const onPressShare = () => {
    modalActions.hideBottomList();
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
    privacy,
  });

  const onPressLeave = () => {
    modalActions.hideBottomList();
    alertLeaveGroup();
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
      onPressAdminTools,
      onPressCopyLink,
      onPressShare,
      onPressLeave,
    });
    modalActions.showBottomList({ data: headerMenuData } as BottomListProps);
  };

  const onPressChat = () => {
    const link = formatChannelLink(teamName, slug);
    openUrl(link);
  };

  const onGoBackOnNotFound = () => {
    // clear all state
    useGroupDetailStore.getState().actions.setGroupDetail(null);
  };

  const onPressSearch = () => {
    actionsFeedSearch.setNewsfeedSearch({ isShow: true });
  };

  const _onPressContentFilterTab = (item: any) => {
    timelineActions.setContentFilter(groupId, item.id);
  };

  const _onPressAttributeFilterTab = (item: any) => {
    timelineActions.setAttributeFilter(groupId, item.id);
  };

  const renderGroupContent = () => {
    // visitors can only see "About" of Private group

    if (showPrivate) {
      return (
        <GroupPrivateWelcome
          onScroll={onScrollHandler}
          onGetInfoLayout={onGetInfoLayout}
          infoDetail={groupInfo}
          community={communityDetail}
        />
      );
    }

    return (
      <GroupContent
        community={communityDetail}
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
              <>
                <GroupTabHeader
                  groupId={groupId}
                  isMemberCommunity={isMemberCommunity}
                  isMember={isMember}
                  communityId={communityId}
                  teamName={teamName}
                />
                <FilterFeedButtonGroup
                  contentFilter={contentFilter}
                  attributeFilter={attributeFilter}
                  onPressContentFilterTab={_onPressContentFilterTab}
                  onPressAttributeFilterTab={_onPressAttributeFilterTab}
                />
              </>
            )
          }
          onPressBack={onGoBack}
          icon="search"
          onPressIcon={onPressSearch}
        />
        <Animated.View testID="group_detail.content" style={[styles.contentContainer, containerAnimation]}>
          {renderGroupContent()}
        </Animated.View>
        <Animated.View onLayout={onButtonBottomLayout} style={[styles.button, buttonStyle]}>
          <GroupJoinCancelButton style={styles.joinBtn} community={communityDetail} />
        </Animated.View>
        <ContentSearch groupId={groupId} />
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
