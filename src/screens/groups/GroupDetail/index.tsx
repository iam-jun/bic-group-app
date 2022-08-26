import { useFocusEffect, ExtendedTheme, useTheme } from '@react-navigation/native';
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
  interpolate, runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue,
} from 'react-native-reanimated';
import Header from '~/beinComponents/Header';
import GroupProfilePlaceholder from '~/beinComponents/placeholder/GroupProfilePlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { groupPrivacy } from '~/constants/privacyTypes';
import useAuth, { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { useMyPermissions } from '~/hooks/permissions';
import { useKeySelector } from '~/hooks/selector';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { rootSwitch } from '~/router/stack';
import GroupContent from '~/screens/groups/GroupDetail/components/GroupContent';
import NoGroupFound from '~/screens/groups/GroupDetail/components/NoGroupFound';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import {
  formatChannelLink, getLink, LINK_GROUP, openUrl,
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

const GroupDetail = (props: any) => {
  const { params } = props.route;
  const { groupId, onGoBack } = params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const { user } = useAuth();
  const userId = useUserIdAuth();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const headerRef = useRef<any>();
  const [groupInfoHeight, setGroupInfoHeight] = useState(300);

  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const { name, privacy } = groupInfo;
  const { name: communityName } = useKeySelector(groupsKeySelector.communityDetail);

  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === groupJoinStatus.member;
  const loadingGroupDetail = useKeySelector(
    groupsKeySelector.loadingGroupDetail,
  );
  const loadingPage = useKeySelector(groupsKeySelector.loadingPage);
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canSetting = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    [
      PERMISSION_KEY.GROUP.EDIT_GROUP_INFO,
      PERMISSION_KEY.GROUP.EDIT_GROUP_PRIVACY,
    ],
  );
  const showPrivate = !isMember && privacy === groupPrivacy.private;

  const buttonShow = useSharedValue(0);

  useFocusEffect(() => {
    if (!userId) {
      rootNavigation.replace(rootSwitch.authStack);
    }
  });

  const getGroupDetail = () => {
    dispatch(groupsActions.getGroupDetail({
      groupId,
      loadingPage: true,
    }));
  };

  const getGroupPosts = useCallback(() => {
    /* Avoid getting group posts of the nonexisting group,
    which will lead to endless fetching group posts in
    httpApiRequest > makeGetStreamRequest */
    const privilegeToFetchPost = isMember
      || privacy === groupPrivacy.public
      || privacy === groupPrivacy.open;

    if (loadingGroupDetail || isEmpty(groupInfo) || !privilegeToFetchPost) {
      return;
    }

    dispatch(groupsActions.clearGroupPosts());
    dispatch(groupsActions.getGroupPosts(groupId));
  }, [groupId, isMember, privacy, loadingGroupDetail, groupInfo]);

  useEffect(
    () => {
      getGroupDetail();
    }, [groupId],
  );

  useEffect(
    () => {
      getGroupPosts();
    }, [groupInfo],
  );

  // visitors cannot see anything of Secret groups
  // => render No Group Found
  if (!isMember && privacy === groupPrivacy.secret && !loadingPage) {
    return <NoGroupFound />;
  }

  const onPressAdminTools = () => {
    dispatch(modalActions.hideBottomList());
    rootNavigation.navigate(
      groupStack.groupAdmin, { groupId },
    );
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideBottomList());
    Clipboard.setString(getLink(
      LINK_GROUP, groupId,
    ));
    dispatch(modalActions.showHideToastMessage({
      content: 'common:text_link_copied_to_clipboard',
      props: {
        textProps: { useI18n: true },
        type: 'success',
      },
    }));
  };

  const onPressShare = () => {
    dispatch(modalActions.hideBottomList());
    const groupLink = getLink(
      LINK_GROUP, groupId,
    );
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
    rootNavigation.navigate(
      groupStack.groupMembers, { groupId },
    );
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

  const onGetInfoLayout = useCallback(
    (e: any) => {
      // to get the height from the start of the cover image to the end of group info
      setGroupInfoHeight(e.nativeEvent.layout.height);
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
        [0, groupInfoHeight - 20, groupInfoHeight],
        [0, 0, 1],
      ),
    }),
    [groupInfoHeight],
  );

  const renderGroupContent = () => {
    // visitors can only see "About" of Private group

    if (showPrivate) {
      return (
        <GroupPrivateWelcome
          onScroll={onScrollHandler}
          onGetInfoLayout={onGetInfoLayout}
          infoDetail={groupInfo}
          isMember={isMember}
        />
      );
    }

    return (
      <GroupContent
        getGroupPosts={getGroupPosts}
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

  const onPressMenu = () => {
    const headerMenuData = getHeaderMenu(
      'group',
      isMember,
      canSetting,
      dispatch,
      onPressAdminTools,
      onPressCopyLink,
      onPressShare,
      undefined,
      undefined,
      undefined,
      onPressLeave,
    );
    dispatch(modalActions.showBottomList({
      isOpen: true,
      data: headerMenuData,
    } as BottomListProps));
  };

  const onPressChat = () => {
    const link = formatChannelLink(
      groupInfo.team_name, groupInfo.slug,
    );
    openUrl(link);
  };

  const renderGroupDetail = () => {
    if (isEmpty(groupInfo)) return <NoGroupFound />;
    return (
      <>
        <Header
          headerRef={headerRef}
          title={name}
          subTitle={`${t('groups:text_in')} ${communityName}`}
          subTitleTextProps={{ variant: 'subtitleXS', numberOfLines: 1 }}
          useAnimationTitle
          rightIcon={canSetting ? 'iconShieldStar' : 'menu'}
          rightIconProps={{ backgroundColor: theme.colors.white }}
          onPressChat={isMember ? onPressChat : undefined}
          onRightPress={onPressMenu}
          showStickyHeight={groupInfoHeight}
          stickyHeaderComponent={!showPrivate && <GroupTabHeader groupId={groupId} isMember={isMember} />}
          onPressBack={onGoBack}
        />
        <View testID="group_detail.content" style={styles.contentContainer}>
          {renderGroupContent()}
        </View>
        <Animated.View style={[styles.button, buttonStyle]}>
          <GroupJoinCancelButton style={styles.joinBtn} />
        </Animated.View>
      </>
    );
  };

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      {loadingPage ? renderPlaceholder() : renderGroupDetail()}
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    screenContainer: {
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
      paddingVertical: spacing.padding.tiny,
    },
  });
};

export default GroupDetail;
