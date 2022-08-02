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

import { runOnJS, useAnimatedScrollHandler } from 'react-native-reanimated';
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
import GroupContent from '~/screens/Groups/GroupDetail/components/GroupContent';
import NoGroupFound from '~/screens/Groups/GroupDetail/components/NoGroupFound';
import groupsActions from '~/screens/Groups/redux/actions';
import modalActions from '~/store/modal/actions';
import spacing from '~/theme/spacing';
import {
  formatChannelLink, getLink, LINK_GROUP, openUrl,
} from '~/utils/link';
import HeaderMenu from '../components/HeaderMenu';
import { checkLastAdmin } from '../helper';
import groupsKeySelector from '../redux/keySelector';
import GroupPrivateWelcome from './components/GroupPrivateWelcome';
import useLeaveGroup from '../GroupMembers/components/useLeaveGroup';
import GroupTabHeader from './components/GroupTabHeader';
import { useBaseHook } from '~/hooks';

const GroupDetail = (props: any) => {
  const { params } = props.route;
  const groupId = params?.groupId;

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
  const { name: communityName } = useKeySelector(groupsKeySelector.communityDetail)

  const joinStatus = useKeySelector(groupsKeySelector.groupDetail.joinStatus);
  const isMember = joinStatus === groupJoinStatus.member;
  const loadingGroupDetail = useKeySelector(
    groupsKeySelector.loadingGroupDetail,
  );
  const loadingPage = useKeySelector(groupsKeySelector.loadingPage);
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canSetting = hasPermissionsOnScopeWithId(
    'groups', groupId, [
      PERMISSION_KEY.GROUP.APPROVE_REJECT_JOINING_REQUESTS,
      PERMISSION_KEY.GROUP.EDIT_INFORMATION,
      PERMISSION_KEY.GROUP.EDIT_PRIVACY,
    ],
  );

  useFocusEffect(() => {
    if (!userId) {
      rootNavigation.replace(rootSwitch.authStack);
    }
  });

  const getGroupDetail = () => {
    dispatch(groupsActions.getGroupDetail(
      groupId, true,
    ));
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
    dispatch(modalActions.hideModal());
    rootNavigation.navigate(
      groupStack.groupAdmin, { groupId },
    );
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideModal());
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
    dispatch(modalActions.hideModal());
    const groupLink = getLink(
      LINK_GROUP, groupId,
    );
    try {
      Share.share({ message: groupLink, url: groupLink })
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
    dispatch(modalActions.hideModal());

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
  }

  const onScrollHandler = useAnimatedScrollHandler((event: any) => {
    const offsetY = event?.contentOffset?.y;
    runOnJS(scrollWrapper)(offsetY);
  });

  const renderGroupContent = () => {
    // visitors can only see "About" of Private group

    if (!isMember && privacy === groupPrivacy.private) {
      return <GroupPrivateWelcome infoDetail={groupInfo} isMember={isMember} />;
    }

    return <GroupContent getGroupPosts={getGroupPosts} onScroll={onScrollHandler} onGetInfoLayout={onGetInfoLayout} />;
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
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <HeaderMenu
          type="group"
          isMember={isMember}
          canSetting={canSetting}
          onPressAdminTools={onPressAdminTools}
          onPressCopyLink={onPressCopyLink}
          onPressShare={onPressShare}
          onPressLeave={onPressLeave}
        />
      ),
      props: {
        isContextMenu: true,
        menuMinWidth: 280,
        modalStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      },
    }));
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
          stickyHeaderComponent={<GroupTabHeader groupId={groupId} isMember={isMember} />}
        />
        <View testID="group_detail.content" style={styles.contentContainer}>
          {renderGroupContent()}
        </View>
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
      backgroundColor: colors.neutral1,
    },
    headerCreatePost: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
  });
};

export default GroupDetail;
