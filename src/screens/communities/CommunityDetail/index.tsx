import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { StyleSheet, DeviceEventEmitter, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import { isEmpty } from 'lodash';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';

import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import ContentView from './components/CommunityContentView';
import CommunityJoinCancelButton from './components/CommunityJoinCancelButton';
import {
  formatChannelLink,
  generateLink,
  LinkGeneratorTypes,
  openUrl,
} from '~/utils/link';
import { chatSchemes } from '~/constants/chat';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';
import CommunityTabHeader from './components/CommunityTabHeader';
import { getHeaderMenu } from './helper';
import { BottomListProps } from '~/components/BottomList';
import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import NotFound from '~/screens/NotFound/components/NotFound';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import PlaceholderView from './components/PlaceholderView';
import { ICommunity } from '~/interfaces/ICommunity';
import { CommunityPrivacyType } from '~/constants/privacyTypes';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useMounted from '~/hooks/mounted';
import useTimelineStore, { ITimelineState } from '~/store/timeline';
import useCommunityController from '../store';
import ContentSearch from '~/screens/Home/HomeSearch';
import FilterFeedButtonGroup from '~/beinComponents/FilterFeedButtonGroup';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import useModalStore from '~/store/modal';
import useFeedSearchStore from '~/screens/Home/HomeSearch/store';
import usePinContentStore from '~/components/PinContent/store';
import TermsView from '~/components/TermsModal';

const CommunityDetail = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;
  const { rootNavigation } = useRootNavigation();

  const headerRef = useRef<any>();
  const [buttonHeight, setButtonHeight] = useState(250);

  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = themeStyles(theme, insets);
  const { t } = useBaseHook();
  const isMounted = useMounted();
  const modalActions = useModalStore((state) => state.actions);

  // community detail
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);
  const controller = useCommunityController((state) => state.actions);
  const isLoadingCommunity = useCommunitiesStore(useCallback((
    state: ICommunitiesState,
  ) => state.requestings[communityId], [communityId]));
  const error = useCommunitiesStore(useCallback((
    state: ICommunitiesState,
  ) => state.errors[communityId], [communityId]));

  const community = useCommunitiesStore(useCallback((
    state: ICommunitiesState,
  ) => state.data[communityId] || {} as ICommunity, [communityId]));

  const {
    name, joinStatus, privacy, groupId,
  } = community;

  // posts
  const timelineActions = useTimelineStore((state: ITimelineState) => state.actions);
  const { timelines } = useTimelineStore();
  const { contentFilter, attributeFilter } = timelines?.[groupId] || {};
  const communityPost = useTimelineStore(
    useCallback((state: ITimelineState) => state.timelines?.[groupId]?.data?.[contentFilter]?.[attributeFilter], [
      groupId,
      contentFilter,
      attributeFilter,
    ]),
  );

  const actionsFeedSearch = useFeedSearchStore((state) => state.actions);
  const actionPinContent = usePinContentStore((state) => state.actions);

  const isMember = joinStatus === GroupJoinStatus.MEMBER;

  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canSetting = shouldHavePermission(
    groupId,
    [
      PermissionKey.ROLE_COMMUNITY_OWNER,
      PermissionKey.ROLE_COMMUNITY_ADMIN,
      PermissionKey.ROLE_GROUP_ADMIN,
    ],
  );
  const isPrivateCommunity = !isMember && privacy === CommunityPrivacyType.PRIVATE;

  const buttonShow = useSharedValue(0);
  const containerPaddingBottom = useSharedValue(0);
  const heightButtonBottom = useSharedValue(0);

  const getCommunityDetail = () => {
    actions.getCommunity(communityId);
  };

  const getPosts = useCallback((isRefresh?: boolean) => {
    /* Avoid getting group posts of the nonexisting group,
      which will lead to endless fetching group posts in
      httpApiRequest > makeGetStreamRequest */
    const privilegeToFetchPost = isMember || privacy === CommunityPrivacyType.OPEN;

    if (isLoadingCommunity || isEmpty(community) || !privilegeToFetchPost) {
      return;
    }
    // By default, the community is treated as the root group
    // So, we should get posts of community by groupId instead of communityId
    timelineActions.getPosts(groupId, isRefresh);
  }, [groupId, isMember, privacy, isLoadingCommunity, community, contentFilter, attributeFilter]);

  useEffect(() => {
    // only update currentCommunityId when navigating to the community profile
    useCommunitiesStore.setState({
      currentCommunityId: communityId,
    });

    if (isMounted) {
      getCommunityDetail();
    }
  }, [isMounted, communityId]);

  useEffect(() => () => {
    useCommunitiesStore.setState({
      currentCommunityId: '',
    });
  }, []);

  useEffect(() => {
    if (isEmpty(timelines[groupId]) && isEmpty(communityPost?.ids)) {
      // for the 1st time timelines[groupId] can be undefined so we must init Data
      if (groupId) timelineActions.initDataTimeline(groupId);
      getPosts();
    }
  },
  [community]);

  useEffect(() => {
    getPosts();
  }, [contentFilter, attributeFilter]);

  useEffect(() => () => {
    if (groupId) timelineActions.resetTimeline(groupId);
  }, [groupId]);

  useMemo(() => {
    // prevent showing the old data before being refreshed
    if (groupId) {
      actionPinContent.resetDataPinContentsGroup(groupId);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) actionPinContent.getPinContentsGroup(groupId);
  }, [groupId]);

  useEffect(() => () => {
    if (groupId) actionPinContent.resetDataPinContentsGroup(groupId);
  }, [groupId]);

  const onRefresh = useCallback((isGetPost: boolean) => {
    /**
     * must getPosts before getCommunityDetail
     * to avoid community data reset and delete groupId
     */
    if (isGetPost) {
      timelineActions.getPosts(groupId, true);
    }
    actionPinContent.getPinContentsGroup(groupId);
    getCommunityDetail();
  }, [groupId, contentFilter, attributeFilter]);

  const onPressAdminTools = () => {
    modalActions.hideBottomList();
    rootNavigation.navigate(groupStack.communityAdmin, { communityId });
  };

  const onPressCopyLink = () => {
    modalActions.hideBottomList();
    Clipboard.setString(generateLink(LinkGeneratorTypes.COMMUNITY, communityId));
    modalActions.showToast({ content: 'common:text_copied' });
  };

  const onConfirmLeaveCommunity = async () => {
    controller.leaveCommunity(communityId);
  };

  const onPressLeave = () => {
    modalActions.hideBottomList();
    modalActions.showAlert({
      title: t('communities:modal_confirm_leave_community:title'),
      confirmLabel: t(
        'communities:modal_confirm_leave_community:button_leave',
      ),
      cancelBtn: true,
      children: (
        <Text.ParagraphM style={styles.childrenText}>
          {t('communities:modal_confirm_leave_community:description')}
          <Text.BodyMMedium>{name}</Text.BodyMMedium>
          ?
        </Text.ParagraphM>
      ),
      onConfirm: onConfirmLeaveCommunity,
    });
  };

  const onRightPress = () => {
    const headerMenuData = getHeaderMenu({
      type: 'community',
      isMember,
      canSetting,
      onPressAdminTools,
      onPressCopyLink,
      onPressLeave,
    });
    modalActions.showBottomList({
      data: headerMenuData,
    } as BottomListProps);
  };

  const onPressChat = () => {
    const link = formatChannelLink(
      community.slug,
      chatSchemes.DEFAULT_CHANNEL,
    );
    openUrl(link);
  };

  const onButtonLayout = useCallback((e: any) => {
    // to get the height from the start of the cover image to the end of button
    setButtonHeight(e.nativeEvent.layout.height);
  }, []);

  const onButtonBottomLayout = useCallback((e: any) => {
    heightButtonBottom.value = e.nativeEvent.layout.height;
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

  const containerAnimation = useAnimatedStyle(() => ({
    paddingBottom: containerPaddingBottom.value,
  }));

  const buttonStyle = useAnimatedStyle(() => {
    const value = interpolate(
      buttonShow.value,
      [0, buttonHeight - 20, buttonHeight],
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
  }, [buttonHeight]);

  const onGoBackOnNotFound = () => {
    // clear community state
    actions.resetCommunity(communityId);
  };

  const onPressSearch = () => {
    actionsFeedSearch.setNewsfeedSearch({ isShow: true });
  };

  const hasNoDataInStore = !groupId;

  const shouldShowPlaceholder = (!isMounted || hasNoDataInStore) && !error;

  if (shouldShowPlaceholder) {
    return <PlaceholderView style={styles.contentContainer} headerStyle={styles.header} />;
  }

  // [TO-DO] Handle other cases
  if (error) {
    return <NotFound onGoBack={onGoBackOnNotFound} />;
  }

  const _onPressContentFilterTab = (item: any) => {
    timelineActions.setContentFilter(groupId, item.id);
  };

  const _onPressAttributeFilterTab = (item: any) => {
    timelineActions.setAttributeFilter(groupId, item.id);
  };

  const headerComponent = isPrivateCommunity
    ? null
    : (
      <>
        <CommunityTabHeader
          communityId={communityId}
          isMember={isMember}
          teamName={community?.teamName}
        />
        <FilterFeedButtonGroup
          contentFilter={contentFilter}
          attributeFilter={attributeFilter}
          onPressContentFilterTab={_onPressContentFilterTab}
          onPressAttributeFilterTab={_onPressAttributeFilterTab}
        />
      </>
    );

  return (
    <View style={styles.screenContainer}>
      <Header
        headerRef={headerRef}
        title={name}
        useAnimationTitle
        rightIcon={canSetting ? 'iconShieldStar' : 'menu'}
        showStickyHeight={buttonHeight}
        stickyHeaderComponent={headerComponent}
        onPressChat={isMember ? onPressChat : undefined}
        onRightPress={onRightPress}
        icon="search"
        onPressIcon={onPressSearch}
      />
      <Animated.View
        testID="community_detail.content"
        style={[
          styles.contentContainer,
          containerAnimation,
        ]}
      >
        <ContentView
          community={community}
          isMember={isMember}
          isFetchingData={isLoadingCommunity}
          isPrivateCommunity={isPrivateCommunity}
          onRefresh={onRefresh}
          onScroll={onScrollHandler}
          onButtonLayout={onButtonLayout}
        />
      </Animated.View>
      <Animated.View onLayout={onButtonBottomLayout} style={[styles.button, buttonStyle]}>
        <CommunityJoinCancelButton
          style={styles.joinBtn}
          community={community || {} as ICommunity}
          isMember={isMember}
        />
      </Animated.View>
      <ContentSearch groupId={groupId} />
      <TermsView />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;

  return StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    contentContainer: {
      flex: 1,
    },
    joinBtn: {
      paddingBottom: spacing.padding.large + insets.bottom,
      paddingTop: spacing.padding.large,
    },
    header: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
    button: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
    },
    childrenText: {
      paddingVertical: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default CommunityDetail;
