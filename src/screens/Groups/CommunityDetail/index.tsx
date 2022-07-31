import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import { isEmpty } from 'lodash';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PrivateWelcome from './components/PrivateWelcome';
import actions from '~/screens/Groups/redux/actions';
import PageContent from './components/PageContent';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import { groupPrivacy } from '~/constants/privacyTypes';
import groupJoinStatus from '~/constants/groupJoinStatus';
import JoinCancelButton from './components/JoinCancelButton';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import GroupProfilePlaceholder from '~/beinComponents/placeholder/GroupProfilePlaceholder';
import { ICommunity } from '~/interfaces/ICommunity';
import { formatChannelLink, openUrl } from '~/utils/link';
import { chatSchemes } from '~/constants/chat';
import modalActions from '~/store/modal/actions';
import HeaderMenu from '../components/HeaderMenu';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';
import TabButtonHeader from './components/TabButtonHeader';

const CommunityDetail = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const headerRef = useRef<any>();
  const [buttonHeight, setButtonHeight] = useState(250);

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {
    name, icon, joinStatus, privacy, groupId,
  } = infoDetail;
  const isMember = joinStatus === groupJoinStatus.member;
  const isGettingInfoDetail = useKeySelector(
    groupsKeySelector.isGettingInfoDetail,
  );
  const loadingPage = useKeySelector(groupsKeySelector.loadingPage);
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canSetting = hasPermissionsOnScopeWithId(
    'communities', communityId, [
      PERMISSION_KEY.COMMUNITY.APPROVE_REJECT_JOINING_REQUESTS,
      PERMISSION_KEY.COMMUNITY.EDIT_INFORMATION,
      PERMISSION_KEY.COMMUNITY.EDIT_PRIVACY,
    ],
  );

  const buttonShow = useSharedValue(0);
  const tabButtonShow = useSharedValue(0);

  const getCommunityDetail = (loadingPage = false) => {
    dispatch(actions.getCommunityDetail({ communityId, loadingPage, showLoading: true }));
  };

  const onRefresh = () => {
    getCommunityDetail();
  };

  const getPosts = useCallback(
    () => {
    /* Avoid getting group posts of the nonexisting group,
    which will lead to endless fetching group posts in
    httpApiRequest > makeGetStreamRequest */
      const privilegeToFetchPost = isMember
      || privacy === groupPrivacy.public
      || privacy === groupPrivacy.open;

      if (isGettingInfoDetail || isEmpty(infoDetail) || !privilegeToFetchPost) {
        return;
      }

      dispatch(actions.clearGroupPosts());
      dispatch(actions.getGroupPosts(groupId));
    }, [groupId, isMember, privacy, isGettingInfoDetail, infoDetail],
  );

  useEffect(
    () => {
      getCommunityDetail(true);

      return () => {
        dispatch(actions.setCommunityDetail({} as ICommunity));
      };
    }, [communityId],
  );

  useEffect(
    () => getPosts(), [infoDetail],
  );

  const onPressAdminTools = () => {
    dispatch(modalActions.hideModal());
    rootNavigation.navigate(
      groupStack.communityAdmin, { communityId },
    );
  };

  const onRightPress = () => {
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <HeaderMenu
          type="community"
          isMember={isMember}
          canSetting={canSetting}
          onPressAdminTools={onPressAdminTools}
        />
      ),
      props: {
        isContextMenu: true,
        menuMinWidth: 280,
        modalStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      },
    }));
  };

  const renderPlaceholder = () => (
    <View
      style={styles.contentContainer}
      testID="community_detail.placeholder"
    >
      <View>
        <GroupProfilePlaceholder disableRandom />
        <HeaderCreatePostPlaceholder style={styles.headerCreatePost} />
        <PostViewPlaceholder disableRandom />
        <PostViewPlaceholder disableRandom />
      </View>
    </View>
  );

  const renderCommunityContent = () => {
    if (!isMember && privacy === groupPrivacy.private) {
      return (
        <PrivateWelcome
          onRefresh={onRefresh}
          onScroll={onScrollHandler}
          onButtonLayout={onButtonLayout}
        />
      );
    }

    return (
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScrollHandler}
        onButtonLayout={onButtonLayout}
      />
    );
  };

  const onPressChat = () => {
    const link = formatChannelLink(
      infoDetail.slug,
      chatSchemes.DEFAULT_CHANNEL,
    );
    openUrl(link);
  };

  const onButtonLayout = useCallback(
    (e: any) => {
    // to get the height from the start of the cover image to the end of button
      setButtonHeight(e.nativeEvent.layout.height);
    }, [],
  );

  const scrollWrapper = (offsetY: number) => {
    headerRef?.current?.setScrollY?.(offsetY);
    DeviceEventEmitter.emit('stopAllVideo');
  }

  const onScrollHandler = useAnimatedScrollHandler((event: any) => {
    const offsetY = event?.contentOffset?.y;
    runOnJS(scrollWrapper)(offsetY);
    buttonShow.value = offsetY;
    tabButtonShow.value = offsetY;
  });

  const buttonStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      width: '100%',
      bottom: 0,
      opacity: interpolate(
        buttonShow.value,
        [0, buttonHeight - 20, buttonHeight],
        [0, 0, 1],
      ),
    }),
    [buttonHeight],
  );

  const tabButtonHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      tabButtonShow.value,
      [0, buttonHeight - 5, buttonHeight],
      [0, 0, 1],
    ),
    transform: [
      {
        translateY: interpolate(
          tabButtonShow.value,
          [0, buttonHeight - 20, buttonHeight],
          [-150, -50, 50],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }), [buttonHeight]);

  const renderCommunityDetail = () => (
    <>
      <Header
        headerRef={headerRef}
        title={name}
        avatar={icon}
        useAnimationTitle
        rightIcon={canSetting ? 'iconShieldStar' : 'menu'}
        rightIconProps={{ backgroundColor: theme.colors.white }}
        onPressChat={isMember ? onPressChat : undefined}
        onRightPress={onRightPress}
        onSearchText={{}} // temp add here to display search icon
      />
      <View testID="community_detail.content" style={styles.contentContainer}>
        {renderCommunityContent()}
      </View>
      <Animated.View style={buttonStyle}>
        <JoinCancelButton style={styles.joinBtn} />
      </Animated.View>
      <Animated.View style={[styles.tabButtonHeader, tabButtonHeaderStyle]}>
        <TabButtonHeader communityId={communityId} isMember={isMember} />
      </Animated.View>
    </>
  );

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      {loadingPage ? renderPlaceholder() : renderCommunityDetail()}
    </ScreenWrapper>
  );
};

export default CommunityDetail;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  return StyleSheet.create({
    screenContainer: {
      backgroundColor: colors.neutral5,
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
    tabButtonHeader: {
      position: 'absolute',
      width: '100%',
      top: insets.top,
    },
  });
};
