import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
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

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PrivateWelcome from './components/PrivateWelcome';
import actions from '~/storeRedux/groups/actions';
import PageContent from './components/PageContent';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../storeRedux/groups/keySelector';
import { groupPrivacy } from '~/constants/privacyTypes';
import groupJoinStatus from '~/constants/groupJoinStatus';
import CommunityJoinCancelButton from './components/CommunityJoinCancelButton';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import GroupProfilePlaceholder from '~/beinComponents/placeholder/GroupProfilePlaceholder';
import { ICommunity } from '~/interfaces/ICommunity';
import {
  formatChannelLink, getLink, LINK_COMMUNITY, openUrl,
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
import useLeaveCommunity from './store';

const CommunityDetail = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const headerRef = useRef<any>();
  const [buttonHeight, setButtonHeight] = useState(250);

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();

  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {
    name, joinStatus, privacy, groupId,
  } = infoDetail;
  const isMember = joinStatus === groupJoinStatus.member;
  const isGettingInfoDetail = useKeySelector(
    groupsKeySelector.isGettingInfoDetail,
  );
  const loadingPage = useKeySelector(groupsKeySelector.loadingPage);
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canSetting = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    [
      PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_INFO,
      PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_PRIVACY,
      PERMISSION_KEY.COMMUNITY.ORDER_MOVE_GROUP_STRUCTURE,
      PERMISSION_KEY.COMMUNITY.CRUD_COMMUNITY_OVERRIDE_SCHEME,
    ],
  );
  const showPrivate = !isMember && privacy === groupPrivacy.private;

  const buttonShow = useSharedValue(0);
  const { doPostLeaveCommunity } = useLeaveCommunity();

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
      const privilegeToFetchPost = isMember || privacy === groupPrivacy.public;

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
    dispatch(modalActions.hideBottomList());
    rootNavigation.navigate(
      groupStack.communityAdmin, { communityId },
    );
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideBottomList());
    Clipboard.setString(getLink(
      LINK_COMMUNITY, communityId,
    ));
    dispatch(modalActions.showHideToastMessage({ content: 'common:text_copied' }));
  };

  const onConfirmLeaveCommunity = async () => {
    doPostLeaveCommunity(communityId, privacy, dispatch);
  };

  const onPressLeave = () => {
    dispatch(modalActions.hideBottomList());
    dispatch(modalActions.showAlert({
      title: t('communities:modal_confirm_leave_community:title'),
      confirmLabel: t('communities:modal_confirm_leave_community:button_leave'),
      cancelBtn: true,
      children: (
        <Text.ParagraphM style={styles.childrenText}>
          {t('communities:modal_confirm_leave_community:description')}
          <Text.BodyMMedium>{name}</Text.BodyMMedium>
          ?
        </Text.ParagraphM>
      ),
      onConfirm: onConfirmLeaveCommunity,
    }));
  };

  const onRightPress = () => {
    const headerMenuData = getHeaderMenu({
      type: 'community', isMember, canSetting, dispatch, onPressAdminTools, onPressCopyLink, onPressLeave,
    });
    dispatch(modalActions.showBottomList({
      isOpen: true,
      data: headerMenuData,
    } as BottomListProps));
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
    if (showPrivate) {
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
  };

  const onScrollHandler = useAnimatedScrollHandler((event: any) => {
    const offsetY = event?.contentOffset?.y;
    runOnJS(scrollWrapper)(offsetY);
    buttonShow.value = offsetY;
  });

  const buttonStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        buttonShow.value,
        [0, buttonHeight - 20, buttonHeight],
        [0, 0, 1],
      ),
    }),
    [buttonHeight],
  );

  const renderCommunityDetail = () => (
    <>
      <Header
        headerRef={headerRef}
        title={name}
        useAnimationTitle
        rightIcon={canSetting ? 'iconShieldStar' : 'menu'}
        onPressChat={isMember ? onPressChat : undefined}
        onRightPress={onRightPress}
        showStickyHeight={buttonHeight}
        stickyHeaderComponent={!showPrivate && <CommunityTabHeader communityId={communityId} isMember={isMember} />}
      />
      <View testID="community_detail.content" style={styles.contentContainer}>
        {renderCommunityContent()}
      </View>
      <Animated.View style={[styles.button, buttonStyle]}>
        <CommunityJoinCancelButton style={styles.joinBtn} />
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
      backgroundColor: colors.gray5,
    },
    contentContainer: {
      flex: 1,
    },
    joinBtn: {
      paddingBottom: spacing.padding.large + insets.bottom,
      paddingTop: spacing.padding.large,
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
    childrenText: {
      paddingVertical: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
  });
};
