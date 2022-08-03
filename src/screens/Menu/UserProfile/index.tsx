import { ExtendedTheme, useIsFocused, useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, ScrollView, StyleSheet, View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { isEmpty } from 'lodash';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import mainStack from '~/router/navigator/MainStack/stack';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import homeActions from '~/screens/Home/redux/actions';
import NoUserFound from '~/screens/Menu/fragments/NoUserFound';
import spacing from '~/theme/spacing';
import { formatDMLink, openUrl } from '~/utils/link';
import menuActions from '../redux/actions';
import menuKeySelector from '../redux/keySelector';
import { BasicInfo, Contact, Experiences } from './fragments';
import CoverHeader from './fragments/CoverHeader';
import UserHeader from './fragments/UserHeader';

const UserProfile = (props: any) => {
  const { userId, params } = props?.route?.params || {};

  const userProfileData = useKeySelector(menuKeySelector.userProfile);
  const {
    fullname,
    description,
    avatar,
    backgroundImgUrl,
    username,
    email,
    city,
    country,
    language,
    phone,
    countryCode,
    relationshipStatus,
    gender,
    birthday,
    latestWork,
  } = userProfileData || {};
  const loadingUserProfile = useKeySelector(menuKeySelector.loadingUserProfile);

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const { username: currentUsername, id } = myProfileData || {};
  const showUserNotFound = useKeySelector(menuKeySelector.showUserNotFound);
  const joinedCommunities = useKeySelector(groupsKeySelector.joinedCommunities);

  const [avatarState, setAvatarState] = useState<string>(avatar);
  const [bgImgState, setBgImgState] = useState<string>(backgroundImgUrl);
  const [isChangeImg, setIsChangeImg] = useState<string>('');

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const currentUserId = useUserIdAuth();
  const isFocused = useIsFocused();
  const isCurrentUser = userId === currentUserId || userId === currentUsername;

  const getUserProfile = () => {
    dispatch(menuActions.clearUserProfile());
    if (userId) {
      dispatch(menuActions.getUserProfile({ userId, params }));
      dispatch(menuActions.getUserWorkExperience(userId));
    }
  };

  useEffect(() => {
    setAvatarState(userProfileData?.avatar);
    setBgImgState(userProfileData?.backgroundImgUrl);
  }, [userProfileData]);

  useEffect(() => {
    isFocused && getUserProfile();
    const { avatar: _avatar, backgroundImgUrl: _bgIm } = myProfileData;
    if (
      userId?.toString?.() === currentUserId?.toString?.()
      || userId?.toString?.() === currentUsername?.toString?.()
    ) {
      if (avatarState !== _avatar || _bgIm !== bgImgState) {
        dispatch(menuActions.getMyProfile({ userId, params }));
        dispatch(homeActions.getHomePosts({ isRefresh: true }));
      }
    }
  }, [isFocused, userId]);

  useEffect(
    () => {
      if (
        userId?.toString?.() === currentUserId?.toString?.()
      || userId?.toString?.() === currentUsername?.toString?.()
      ) {
        if (isChangeImg === 'avatar') {
          dispatch(homeActions.getHomePosts({ isRefresh: true }));
          setAvatarState(myProfileData?.avatar);
        } else if (isChangeImg === 'backgroundImgUrl') {
          setBgImgState(myProfileData?.backgroundImgUrl);
        }
      }
    }, [myProfileData],
  );

  const uploadCallback = (fieldName:string) => {
    setIsChangeImg(fieldName)
  }

  const onEditProfileButton = () => rootNavigation.navigate(
    mainStack.userEdit, { userId },
  );

  const onPressChat = isCurrentUser ? undefined : () => {
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

  const renderButton = () => {
    if (!isCurrentUser) return null;

    return (
      <Button.Secondary
        testID="user_profile.edit"
        textColor={theme.colors.purple50}
        style={styles.buttonEdit}
        leftIcon="PenLine"
        onPress={onEditProfileButton}
        borderRadius={spacing.borderRadius.small}
      >
        {t('profile:title_edit_profile')}
      </Button.Secondary>
    )
  };

  const renderLoading = () => (
    <View testID="user_profile.loading" style={styles.loadingProfile}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (showUserNotFound) return <NoUserFound />;

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header onPressChat={onPressChat} />
      {loadingUserProfile ? (
        renderLoading()
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <CoverHeader
            id={id}
            userId={userId}
            currentUsername={currentUsername}
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
          {renderButton()}
          <View style={styles.infoContainer}>
            <BasicInfo
              fullname={fullname}
              gender={gender}
              birthday={birthday}
              language={language}
              relationship={relationshipStatus}
            />
            <Divider />
            <Contact
              email={email}
              phone={phone}
              city={city}
              country={country}
            />
            <Divider />
            <Experiences />
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

export default UserProfile;

const themeStyles = (
  theme: ExtendedTheme,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    infoContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    loadingProfile: {
      marginTop: spacing.margin.extraLarge,
    },
    buttonEdit: {
      marginHorizontal: spacing.margin.large,
      borderWidth: 1,
      borderColor: colors.purple50,
    },
  });
};
