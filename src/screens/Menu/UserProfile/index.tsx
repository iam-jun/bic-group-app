import {
  ExtendedTheme,
  useIsFocused,
  useTheme,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, ScrollView, StyleSheet, View,
} from 'react-native';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import Divider from '~/beinComponents/Divider';
import { useUserIdAuth } from '~/hooks/auth';
import useHomeStore from '~/screens/Home/store';
import NoUserFound from '~/screens/Menu/components/NoUserFound';
import spacing from '~/theme/spacing';
import CoverHeader from './fragments/CoverHeader';
import UserHeader from './fragments/UserHeader';
import useUserProfileStore from './store';
import useCommonController from '~/screens/store';
import Tab from '~/baseComponents/Tab';
import UserInfo from './fragments/UserInfo';
import BadgeCollection from './fragments/BadgeCollection';
// import Tooltip from '../../../components/Tooltip.tsx';

const screenId = 'userProfile';

export const USER_TABS = [
  { id: '1', text: 'user:user_tab_types:title_about' },
  { id: '2', text: 'user:user_tab_types:title_badge_collection' },
];

const UserProfile = (props: any) => {
  const { userId, params, targetIndex = 0 } = props?.route?.params || {};

  const userProfileData = useUserProfileStore((state) => state.data);
  const loading = useUserProfileStore((state) => state.loading);
  const error = useUserProfileStore((state) => state.error);
  const userProfileActions = useUserProfileStore((state) => state.actions);
  const reset = useUserProfileStore((state) => state.reset);

  const {
    fullname,
    avatar,
    backgroundImgUrl,
    username,
    email,
    city,
    language,
    phone,
    countryCode,
    relationshipStatus,
    gender,
    birthday,
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
        <>
          <CoverHeader
            id={id}
            isCurrentUser={isCurrentUser}
            bgImg={bgImgState}
            avatar={avatarState}
            uploadCallback={uploadCallback}
          />
          <UserHeader
            screenId={screenId}
            id={userId}
            fullname={fullname}
            username={username}
            latestWork={latestWork}
            isCurrentUser={isCurrentUser}
            isVerified={isVerified}
          />
          <Divider color={colors.gray5} size={spacing.padding.large} />
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {isCurrentUser ? (
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
            ) : null}
            {renderContent()}
            {/* <Tooltip screenId={screenId} /> */}
          </ScrollView>
        </>
      )}
    </ScreenWrapper>
  );
};

export default UserProfile;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    loadingProfile: {
      marginTop: spacing.margin.extraLarge,
    },
    tabContainer: {
      backgroundColor: colors.white,
      marginTop: spacing.margin.large,
    },
  });
};
