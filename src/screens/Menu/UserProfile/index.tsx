import {
  ExtendedTheme,
  useIsFocused,
  useTheme,
} from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, DeviceEventEmitter, RefreshControl, StyleSheet, View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { throttle } from 'lodash';
import Animated, {
  interpolate, runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';

import Divider from '~/beinComponents/Divider';
import { useUserIdAuth } from '~/hooks/auth';
import useHomeStore from '~/screens/Home/store';
import NoUserFound from '~/screens/Menu/components/NoUserFound';
import spacing, { borderRadius } from '~/theme/spacing';
import CoverHeader from './fragments/CoverHeader';
import useUserProfileStore from './store';
import useCommonController from '~/screens/store';
import Tab from '~/baseComponents/Tab';
import UserInfo from './fragments/UserInfo';
import BadgeCollection from './fragments/BadgeCollection';
import useUserBadge from './fragments/BadgeCollection/store';
import UserHeader from './fragments/UserHeader';
import { USER_TABS_TYPES } from './constants';
import SearchBadgeModal from './fragments/SearchBadgeModal';
import { useBaseHook } from '~/hooks';
import TabButton from '~/baseComponents/Tab/TabButton';
import Text from '~/baseComponents/Text';
import BadgeCollectionHeader from './fragments/BadgeCollection/BadgeCollectionHeader';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import InvitationList from './fragments/InvitationList';
import useMyInvitationsStore from './fragments/InvitationList/store';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';

export const USER_TABS = [
  { id: USER_TABS_TYPES.USER_ABOUT, text: 'user:user_tab_types:title_about' },
  { id: USER_TABS_TYPES.USER_INVITATIONS, text: 'user:user_tab_types:title_invitations' },
  { id: USER_TABS_TYPES.USER_BADGE_COLLECTION, text: 'user:user_tab_types:title_badge_collection' },
];

const UserProfile = (props: any) => {
  const { userId, params, targetIndex = 0 } = props?.route?.params || {};

  const userProfileData = useUserProfileStore((state) => state.data);
  const loading = useUserProfileStore((state) => state.loading);
  const error = useUserProfileStore((state) => state.error);
  const userProfileActions = useUserProfileStore((state) => state.actions);
  const reset = useUserProfileStore((state) => state.reset);
  const resetUserBadge = useUserBadge((state) => state.reset);
  const showingBadges = useUserBadge((state) => state.showingBadges);
  const showValue = useSharedValue(0);

  const {
    fullname,
    avatar = '',
    backgroundImgUrl = '',
    username,
    latestWork,
    isVerified,
  } = userProfileData || {};

  const myProfileData = useCommonController((state) => state.myProfile);
  const { username: currentUsername, id } = myProfileData || {};

  const [avatarState, setAvatarState] = useState<string>(avatar);
  const [bgImgState, setBgImgState] = useState<string>(backgroundImgUrl);
  const [isChangeImg, setIsChangeImg] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(targetIndex || 0);
  const [refreshing, setRefreshing] = useState(false);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const { t } = useBaseHook();

  const currentUserId = useUserIdAuth();
  const isFocused = useIsFocused();
  const isCurrentUser = userId === currentUserId || userId === currentUsername;

  const homeActions = useHomeStore((state) => state.actions);
  const hasNewBadge = useUserBadge((state) => state.hasNewBadge);
  const userBadgeActions = useUserBadge((state) => state.actions);
  const invitationActions = useMyInvitationsStore((state) => state.actions);
  const { rootNavigation } = useRootNavigation();

  useEffect(() => {
    isFocused && userProfileActions.getUserProfile({ userId, params });
    userId && userProfileActions.getWorkExperience(userId);
    if (userId === currentUserId) {
      userBadgeActions.getOwnedBadges();
    }
  }, [isFocused, userId]);

  useEffect(() => {
    setAvatarState(avatar);
    setBgImgState(backgroundImgUrl);
  }, [userProfileData]);

  useEffect(() => {
    if (
      userId?.toString?.() === currentUserId?.toString?.()
      || userId?.toString?.() === currentUsername?.toString?.()
    ) {
      if (isChangeImg === 'avatar') {
        homeActions.refreshHome();
        setAvatarState(myProfileData?.avatar);
      } else if (isChangeImg === 'backgroundImgUrl') {
        setBgImgState(myProfileData?.backgroundImgUrl);
      }
    }
  }, [myProfileData]);

  const onPressBack = () => {
    resetUserBadge();
    reset();
    if (!isCurrentUser) {
      userProfileActions.getUserProfile({ userId: currentUserId });
      userProfileActions.getWorkExperience(currentUserId);
      userBadgeActions.getOwnedBadges();
    }
    rootNavigation.goBack();
  };

  useBackPressListener(onPressBack);

  const onRefresh = () => {
    setRefreshing(true);
    userProfileActions.getUserProfile({ userId, params, silentLoading: true });
    userId && userProfileActions.getWorkExperience(userId);
    if (
      userId?.toString?.() === currentUserId?.toString?.()
      || userId?.toString?.() === currentUsername?.toString?.()
    ) {
      userBadgeActions.getOwnedBadges();
      invitationActions.getInvitations(true);
    }
    setRefreshing(false);
  };

  const handleEditBadge = () => {
    userBadgeActions.setIsEditing(true);
  };

  const uploadCallback = (fieldName: string) => {
    setIsChangeImg(fieldName);
  };

  const onPressTab = (index: number) => {
    setSelectedIndex(index);
  };

  const scrollWrapper = throttle(
    (offsetY: number) => {
      if (offsetY < 0) {
        return;
      }
      DeviceEventEmitter.emit(
        'off-tooltip',
      );
      if (offsetY > 400 && showValue.value === 0) {
        showValue.value = withTiming(1, { duration: 100 });
      } else if (offsetY < 400 && showValue.value === 1) {
        showValue.value = withTiming(0, { duration: 100 });
      }
    }, 300,
  );

  const handleScroll = useAnimatedScrollHandler((event: any) => {
    const offsetY = event?.contentOffset?.y;
    runOnJS(scrollWrapper)(offsetY);
  });

  const headerAnimated = useAnimatedStyle(() => ({
    zIndex: showValue.value ? 1 : -1,
    opacity: interpolate(showValue.value, [0, 1], [0, 1]),
  }));

  const renderLoading = () => (
    <View testID="user_profile.loading" style={styles.loadingProfile}>
      <ActivityIndicator size="large" />
    </View>
  );

  const renderContent = () => {
    if (selectedIndex === 0) {
      return <UserInfo isCurrentUser={isCurrentUser} />;
    }

    if (selectedIndex === 1) {
      return <InvitationList />;
    }

    if (selectedIndex === 2) {
      return <BadgeCollection />;
    }

    return null;
  };

  const renderTabContainer = (text: string, index: number) => {
    const shouldShowDot = Boolean(hasNewBadge) && Boolean(index === 2);
    return (
      <Text.TabM
        color={Boolean(selectedIndex === index) ? colors.purple50 : colors.neutral40}
      >
        {`${t(text)}${shouldShowDot ? '    ' : ''}`}
        {shouldShowDot && (
        <View style={styles.dot} />
        ) }
      </Text.TabM>
    );
  };

  const renderCustomTab = (item: any, index) => (
    <TabButton
      key={`tab-button-${item?.id || item?.text}`}
      size="large"
      isSelected={selectedIndex === index}
      ContentComponent={renderTabContainer(item?.text, index)}
      onPress={() => onPressTab(index)}
    />
  );

  const renderHeader = useCallback(() => (
    <>
      <CoverHeader
        id={id}
        isCurrentUser={isCurrentUser}
        bgImg={bgImgState}
        avatar={avatarState}
        uploadCallback={uploadCallback}
      />
      <UserHeader
        id={userId}
        fullname={fullname}
        username={username}
        latestWork={latestWork}
        isCurrentUser={isCurrentUser}
        isVerified={isVerified}
        showingBadges={showingBadges}
        handleEditBadge={handleEditBadge}
      />
      <Divider color={colors.gray5} size={spacing.padding.large} />
    </>
  ), [id, avatarState, bgImgState, isCurrentUser, showingBadges]);

  const renderItem = () => {
    if (Boolean(isCurrentUser)) {
      return (
        <>
          <View style={styles.tabContainer}>
            <Tab
              data={USER_TABS}
              renderCustomTab={renderCustomTab}
            />
          </View>
          <Divider color={colors.gray5} size={spacing.padding.large} />
        </>
      );
    }
    return null;
  };

  if (!!error && !loading) return <NoUserFound />;
  // TODO: to handle more error cases in the future

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header onPressBack={onPressBack} />
      {Boolean(isCurrentUser) && Boolean(selectedIndex === 2)
      && (
      <Animated.View style={[styles.badgesHeader, headerAnimated]}>
        <Header />
        <ViewSpacing height={spacing.padding.large} />
        <BadgeCollectionHeader />
      </Animated.View>
      )}
      {loading ? (
        renderLoading()
      ) : (
        <Animated.FlatList
          style={styles.container}
          data={[1]}
          renderItem={renderItem}
          refreshControl={(
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={onRefresh}
              tintColor={colors.gray40}
            />
          )}
          keyExtractor={(item) => `${item?.toString?.()}`}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
        />
      )}
      <SearchBadgeModal showSearchBox />
    </ScreenWrapper>
  );
};

export default UserProfile;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      flex: 1,
    },
    loadingProfile: {
      marginTop: spacing.margin.extraLarge,
    },
    tabContainer: {
      backgroundColor: colors.white,
      marginTop: spacing.margin.large,
    },
    bottomButton: {
      backgroundColor: colors.white,
      paddingTop: spacing.padding.base,
      paddingRight: spacing.padding.large,
      paddingBottom: insets.bottom || spacing.padding.large,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
      right: 0,
      left: 0,
      borderTopWidth: 1,
      borderTopColor: colors.neutral5,
    },
    dot: {
      backgroundColor: colors.red40,
      width: spacing.padding.xSmall,
      height: spacing.padding.xSmall,
      borderRadius: borderRadius.pill,
    },
    badgesHeader: {
      top: 0,
      position: 'absolute',
      backgroundColor: colors.white,
      width: '100%',
      paddingBottom: spacing.padding.large,
      zIndex: 2,
    },
  });
};
