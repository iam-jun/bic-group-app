import {
  ExtendedTheme,
  useIsFocused,
  useTheme,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, DeviceEventEmitter, ScrollView, StyleSheet, View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { throttle } from 'lodash';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import Divider from '~/beinComponents/Divider';
import { useUserIdAuth } from '~/hooks/auth';
import useHomeStore from '~/screens/Home/store';
import NoUserFound from '~/screens/Menu/components/NoUserFound';
import spacing from '~/theme/spacing';
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

export const USER_TABS = [
  { id: USER_TABS_TYPES.USER_ABOUT, text: 'user:user_tab_types:title_about' },
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

  const {
    fullname,
    avatar,
    backgroundImgUrl,
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

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  const currentUserId = useUserIdAuth();
  const isFocused = useIsFocused();
  const isCurrentUser = userId === currentUserId || userId === currentUsername;

  const homeActions = useHomeStore((state) => state.actions);

  useEffect(() => {
    isFocused && userProfileActions.getUserProfile({ userId, params });
    userId && userProfileActions.getWorkExperience(userId);
    resetUserBadge();
    return () => reset();
  }, [isFocused, userId]);

  useEffect(() => {
    setAvatarState(userProfileData?.avatar);
    setBgImgState(userProfileData?.backgroundImgUrl);
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

  const uploadCallback = (fieldName: string) => {
    setIsChangeImg(fieldName);
  };

  const onPressTab = (item: any, index: number) => {
    setSelectedIndex(index);
  };

  const handleScroll = throttle(
    () => {
      DeviceEventEmitter.emit(
        'off-tooltip',
      );
    }, 100,
  );

  const renderLoading = () => (
    <View testID="user_profile.loading" style={styles.loadingProfile}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (error) return <NoUserFound />;
  // TODO: to handle more error cases in the future

  const renderContent = () => {
    if (selectedIndex === 0) {
      return <UserInfo isCurrentUser={isCurrentUser} />;
    }

    if (selectedIndex === 1) {
      return (
        <BadgeCollection />
      );
    }

    return null;
  };

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header />
      {loading ? (
        renderLoading()
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
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
            handleEditBadge={() => setSelectedIndex(1)}
          />
          <Divider color={colors.gray5} size={spacing.padding.large} />
          {Boolean(isCurrentUser) && (
            <>
              <View style={styles.tabContainer}>
                <Tab
                  buttonProps={{ size: 'large', type: 'primary', useI18n: true }}
                  data={USER_TABS}
                  onPressTab={onPressTab}
                  activeIndex={selectedIndex}
                />
              </View>
              <Divider color={colors.gray5} size={spacing.padding.large} />
            </>
          )}

          {renderContent()}
        </ScrollView>
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
  });
};
