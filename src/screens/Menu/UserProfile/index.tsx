import {
  ExtendedTheme,
  useIsFocused,
  useTheme,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, ScrollView, StyleSheet, View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { isEmpty } from 'lodash';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import Divider from '~/beinComponents/Divider';
import { useUserIdAuth } from '~/hooks/auth';
import { useKeySelector } from '~/hooks/selector';
import useHomeStore from '~/screens/Home/store';
import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import NoUserFound from '~/screens/Menu/components/NoUserFound';
import spacing from '~/theme/spacing';
import { formatDMLink, openUrl } from '~/utils/link';
import { BasicInfo, Contact, Experiences } from './fragments';
import CoverHeader from './fragments/CoverHeader';
import UserHeader from './fragments/UserHeader';
import useUserProfileStore from './store';
import useCommonController from '~/screens/store';

const UserProfile = (props: any) => {
  const { userId, params } = props?.route?.params || {};

  const userProfileData = useUserProfileStore((state) => state.data);
  const loading = useUserProfileStore((state) => state.loading);
  const error = useUserProfileStore((state) => state.error);
  const userProfileActions = useUserProfileStore((state) => state.actions);
  const reset = useUserProfileStore((state) => state.reset);

  const {
    fullname,
    description,
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
  } = userProfileData || {};

  const actions = useCommonController((state) => state.actions);
  const myProfileData = useCommonController((state) => state.myProfile);
  const { username: currentUsername, id } = myProfileData || {};
  const joinedCommunities = useKeySelector(groupsKeySelector.joinedCommunities);

  const [avatarState, setAvatarState] = useState<string>(avatar);
  const [bgImgState, setBgImgState] = useState<string>(backgroundImgUrl);
  const [isChangeImg, setIsChangeImg] = useState<string>('');

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const currentUserId = useUserIdAuth();
  const isFocused = useIsFocused();
  const isCurrentUser = userId === currentUserId || userId === currentUsername;

  const homeActions = useHomeStore((state) => state.actions);

  useEffect(() => {
    isFocused && userProfileActions.getUserProfile({ userId, params });
    userId && userProfileActions.getWorkExperience(userId);

    const { avatar: _avatar, backgroundImgUrl: _bgIm } = myProfileData;
    if (
      userId?.toString?.() === currentUserId?.toString?.()
      || userId?.toString?.() === currentUsername?.toString?.()
    ) {
      if (avatarState !== _avatar || _bgIm !== bgImgState) {
        actions.getMyProfile({ userId, params });
        homeActions.refreshHome();
      }
    }

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

  const onPressChat = isCurrentUser
    ? undefined
    : () => {
      if (!isEmpty(joinedCommunities)) {
        const link = formatDMLink(
          joinedCommunities?.[0]?.slug,
          userProfileData.username,
        );
        openUrl(link);
      } else {
        dispatch(groupsActions.getMyCommunities({ callback: onPressChat }));
      }
    };

  const renderLoading = () => (
    <View testID="user_profile.loading" style={styles.loadingProfile}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (error) return <NoUserFound />;
  // TODO: to handle more error cases in the future

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header onPressChat={onPressChat} />
      {loading ? (
        renderLoading()
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <CoverHeader
            id={id}
            isCurrentUser={isCurrentUser}
            bgImg={bgImgState}
            avatar={avatarState}
            uploadCallback={uploadCallback}
          />
          <UserHeader
            fullname={fullname}
            username={username}
            latestWork={latestWork}
            description={description}
          />
          <Divider color={colors.gray5} size={spacing.padding.large} />
          <BasicInfo
            fullname={fullname}
            gender={gender}
            birthday={birthday}
            language={language}
            relationship={relationshipStatus}
            isCurrentUser={isCurrentUser}
          />
          <Divider color={colors.gray5} size={spacing.padding.large} />
          <Contact
            email={email}
            phone={phone}
            city={city}
            countryCode={countryCode}
            isCurrentUser={isCurrentUser}
          />
          <Experiences isCurrentUser={isCurrentUser} />
        </ScrollView>
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
  });
};
