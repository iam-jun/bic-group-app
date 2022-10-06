import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { StyleSheet, DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
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
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import groupActions from '~/storeRedux/groups/actions';
import ContentView from './components/ContentView';
import CommunityJoinCancelButton from './components/CommunityJoinCancelButton';
import {
  formatChannelLink,
  getLink,
  LINK_COMMUNITY,
  openUrl,
} from '~/utils/link';
import { chatSchemes } from '~/constants/chat';
import modalActions from '~/storeRedux/modal/actions';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';
import CommunityTabHeader from './components/CommunityTabHeader';
import { getHeaderMenu } from './helper';
import { BottomListProps } from '~/components/BottomList';
import { useBaseHook } from '~/hooks';
import Text from '~/beinComponents/Text';
import NotFound from '~/screens/NotFound/components/NotFound';
import useCommunitiesStore from '~/store/comunities';
import ICommunitiesState from '~/store/comunities/Interface';
import PlaceholderView from './components/PlaceholderView';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import { ICommunity } from '~/interfaces/ICommunity';
import { CommunityPrivacyType } from '~/constants/privacyTypes';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useMounted from '~/hooks/mounted';

const CommunityDetail = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const headerRef = useRef<any>();
  const [buttonHeight, setButtonHeight] = useState(250);

  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = themeStyles(theme, insets);
  const { t } = useBaseHook();
  const isMounted = useMounted();

  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);
  const isFetchingData = useCommunitiesStore((state: ICommunitiesState) => state.requestings[communityId]);
  const error = useCommunitiesStore((state: ICommunitiesState) => state.errors[communityId]);
  const data = useCommunitiesStore((state: ICommunitiesState) => state.data[communityId]);
  const {
    name, joinStatus, privacy, groupId,
  } = data || {};

  const posts = useKeySelector(groupsKeySelector.posts);
  const refreshingGroupPosts = useKeySelector(groupsKeySelector.refreshingGroupPosts);

  const isMember = joinStatus === GroupJoinStatus.MEMBER;

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canSetting = hasPermissionsOnScopeWithId('communities', communityId, [
    PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_INFO,
    PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_PRIVACY,
    PERMISSION_KEY.COMMUNITY.ORDER_MOVE_GROUP_STRUCTURE,
    PERMISSION_KEY.COMMUNITY.CRUD_COMMUNITY_OVERRIDE_SCHEME,
  ]);
  const isPrivateCommunity = !isMember && privacy === CommunityPrivacyType.PRIVATE;

  const buttonShow = useSharedValue(0);
  const containerPaddingBottom = useSharedValue(0);
  const heightButtonBottom = useSharedValue(0);

  const getCommunityDetail = () => {
    actions.getCommunity(communityId);
  };

  const getPosts = useCallback(() => {
    /* Avoid getting group posts of the nonexisting group,
      which will lead to endless fetching group posts in
      httpApiRequest > makeGetStreamRequest */
    const privilegeToFetchPost = isMember || privacy === CommunityPrivacyType.PUBLIC;

    if (isFetchingData || isEmpty(data) || !privilegeToFetchPost) {
      return;
    }

    dispatch(groupActions.clearGroupPosts());
    dispatch(groupActions.getGroupPosts(groupId));
  }, [groupId, isMember, privacy, isFetchingData, data]);

  useEffect(() => {
    if (isMounted) {
      getCommunityDetail();
      dispatch(groupActions.clearGroupPosts());
    }
  }, [isMounted, communityId]);

  useEffect(() => getPosts(), [data]);

  const onRefresh = useCallback((isGetPost: boolean) => {
    getCommunityDetail();
    if (isGetPost) { getPosts(); }
  }, [communityId]);

  const onPressAdminTools = () => {
    dispatch(modalActions.hideBottomList());
    rootNavigation.navigate(groupStack.communityAdmin, { communityId });
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideBottomList());
    Clipboard.setString(getLink(LINK_COMMUNITY, communityId));
    dispatch(
      modalActions.showHideToastMessage({ content: 'common:text_copied' }),
    );
  };

  const onConfirmLeaveCommunity = async () => {
    actions.leaveCommunity(communityId, privacy);
  };

  const onPressLeave = () => {
    dispatch(modalActions.hideBottomList());
    dispatch(
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
      }),
    );
  };

  const onRightPress = () => {
    const headerMenuData = getHeaderMenu({
      type: 'community',
      isMember,
      canSetting,
      dispatch,
      onPressAdminTools,
      onPressCopyLink,
      onPressLeave,
    });
    dispatch(
      modalActions.showBottomList({
        isOpen: true,
        data: headerMenuData,
      } as BottomListProps),
    );
  };

  const onPressChat = () => {
    const link = formatChannelLink(
      data.slug,
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

  const isLoadingCommunity = !!isFetchingData;
  const hasNoDataInStore = !data;
  const isLoadingPosts = (posts.loading && posts.data.length === 0) && !refreshingGroupPosts;
  const shouldShowPlaceholder = !isMounted || hasNoDataInStore || isLoadingCommunity || isLoadingPosts;

  if (shouldShowPlaceholder) {
    return <PlaceholderView style={styles.contentContainer} headerStyle={styles.header} />;
  }

  // [TO-DO] Handle other cases
  if (error) {
    return <NotFound onGoBack={onGoBackOnNotFound} />;
  }

  const headerComponent = isPrivateCommunity
    ? null
    : <CommunityTabHeader communityId={communityId} isMember={isMember} />;

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      <Header
        headerRef={headerRef}
        title={name}
        useAnimationTitle
        rightIcon={canSetting ? 'iconShieldStar' : 'menu'}
        showStickyHeight={buttonHeight}
        stickyHeaderComponent={headerComponent}
        onPressChat={isMember ? onPressChat : undefined}
        onRightPress={onRightPress}
      />
      <Animated.View
        testID="community_detail.content"
        style={[
          styles.contentContainer,
          containerAnimation,
        ]}
      >
        <ContentView
          community={data || {} as ICommunity}
          isFetchingData={isFetchingData}
          isMember={isMember}
          isPrivateCommunity={isPrivateCommunity}
          onRefresh={onRefresh}
          onScroll={onScrollHandler}
          onButtonLayout={onButtonLayout}
        />
      </Animated.View>
      <Animated.View onLayout={onButtonBottomLayout} style={[styles.button, buttonStyle]}>
        <CommunityJoinCancelButton
          style={styles.joinBtn}
          community={data || {} as ICommunity}
          isMember={isMember}
        />
      </Animated.View>
    </ScreenWrapper>
  );
};

export default CommunityDetail;

const themeStyles = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;

  return StyleSheet.create({
    screenContainer: {
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
